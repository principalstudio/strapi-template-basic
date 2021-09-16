'use strict';

/**
 * User.js controller
 *
 * @description: A set of functions called "actions" for managing `User`.
 */

const _ = require('lodash');
const randomstring = require('randomstring');
const { sanitizeEntity } = require('strapi-utils');

const sanitizeUser = (user) =>
  sanitizeEntity(user, {
    model: strapi.query('user', 'users-permissions').model,
  });

module.exports = {
  /**
   * Update logged in user record.
   * @return {Object}
   */
  async updateMe(ctx) {
    const user = ctx.state.user;
    const email = ctx.request.body.email;
    const host = strapi.config.get('server.host');
    const port = strapi.config.get('server.port');
    const url = strapi.config.get('server.url') || `http://${host}:${port}`;
    const weezeventsApiKey = process.env.WEEZEVENTS_API_KEY;
    const weezeventsAccessToken = process.env.WEEZEVENTS_ACCESS_TOKEN;
    const emailHasChanged =
      _.has(ctx.request.body, 'email') && user.email !== email;
    const recoveryCode = emailHasChanged
      ? randomstring.generate({ length: 8, charset: 'numeric' })
      : null;
    const { id } = user;
    let userHasVipAccess = false;

    // the user can submit an access pass only if the field is empty
    if (_.has(ctx.request.body, 'access_pass')) {
      if (ctx.request.body.access_pass === '') {
        return ctx.badRequest(null, [
          {
            messages: [{ id: 'The submitted access pass is invalid' }],
          },
        ]);
      }

      if (ctx.state.user.access_pass) {
        return ctx.badRequest(null, [
          {
            messages: [{ id: 'The user already has an access pass set' }],
          },
        ]);
      }

      // verify access pass
      const accessData = await strapi.config.functions[
        'verify-weezevent-tickets'
      ](strapi, [user], ctx.request.body.access_pass);
      userHasVipAccess = accessData.usersWithAccess.length === 1;
      ctx.request.body.access_pass_is_valid = userHasVipAccess;

      if (!userHasVipAccess) {
        return ctx.badRequest(null, [
          {
            messages: [{ id: 'The submitted access pass is invalid' }],
          },
        ]);
      }
    }

    if (
      _.has(ctx.request.body, 'username') ||
      _.has(ctx.request.body, 'password') ||
      _.has(ctx.request.body, 'linked_exhibitor') ||
      _.has(ctx.request.body, 'recovery_code') ||
      _.has(ctx.request.body, 'recovery_email') ||
      _.has(ctx.request.body, 'access_pass_is_valid') ||
      _.has(ctx.request.body, 'role') ||
      _.has(ctx.request.body, 'username')
    ) {
      return ctx.badRequest(null, [
        {
          messages: [{ id: 'The submitted body contains illegal fields' }],
        },
      ]);
    }

    // mark user as unconfirmed because they are changing their email
    if (emailHasChanged) {
      ctx.request.body.confirmed = false;
      ctx.request.body.recovery_code = recoveryCode;
      ctx.request.body.recovery_email = user.email;
    }

    let updateData = {
      ...ctx.request.body,
    };

    const data = await strapi.plugins['users-permissions'].services.user.edit(
      { id },
      updateData
    );

    await ctx.send(sanitizeUser(data));

    // if user changed his email, confirm new email and notify old email
    if (emailHasChanged) {
      await strapi.plugins[
        'users-permissions'
      ].services.user.sendConfirmationEmail(user);

      // notify old email
      await strapi.plugins.email.services.email.sendTemplatedEmail(
        {
          to: user.email,
        },
        {
          subject: 'Email changed for account',
          text: `The email linked to your account was changed from <%= oldEmail %> to <%= newEmail %>.`,
          html: `<p>The email linked to your account was changed from <%= oldEmail %> to <%= newEmail %>.</p>
            <p>If you did not initiate the change, contact us and provide the following recovery code: <%= recoveryCode %></p>`,
        },
        {
          oldEmail: user.email,
          newEmail: email,
          recoveryCode,
        }
      );
    }
  },
};
