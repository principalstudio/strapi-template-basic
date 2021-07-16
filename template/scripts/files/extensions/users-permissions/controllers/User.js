'use strict';

/**
 * User.js controller
 *
 * @description: A set of functions called "actions" for managing `User`.
 */

const _ = require('lodash');
const { sanitizeEntity } = require('strapi-utils');

const sanitizeUser = user =>
  sanitizeEntity(user, {
    model: strapi.query('user', 'users-permissions').model,
  });

module.exports = {
  /**
   * Update logged in user record.
   * @return {Object}
   */
  async updateMe(ctx) {
    const advancedConfigs = await strapi
      .store({
        environment: '',
        type: 'plugin',
        name: 'users-permissions',
        key: 'advanced',
      })
      .get();

    const user = ctx.state.user;
    const { id } = user;

    if (_.has(ctx.request.body, 'email')) {
      return ctx.badRequest(null, [{ messages: [{ id: 'Updating email is not permitted with this method' }] }]);
    }

    if (_.has(ctx.request.body, 'username')) {
      return ctx.badRequest(null, [{ messages: [{ id: 'Updating username is not permitted with this methodd' }] }]);
    }

    if (_.has(ctx.request.body, 'password')) {
      return ctx.badRequest(null, [{ messages: [{ id: 'Updating password is not permitted with this method' }] }]);
    }

    let updateData = {
      ...ctx.request.body,
    };

    const data = await strapi.plugins['users-permissions'].services.user.edit({ id }, updateData);

    ctx.send(sanitizeUser(data));
  },
};
