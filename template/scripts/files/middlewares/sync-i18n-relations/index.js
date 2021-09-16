const Router = require('koa-router');
const _ = require('lodash');
const PLUGIN_NAME = 'sync-i18n-relations';

/**
 * Creates the i18n relations syncing middleware for strapi
 *
 * @param {Strapi} strapi
 */
const Sync = (strapi) => {
  const options = _.get(
    strapi,
    `config.middleware.settings.${PLUGIN_NAME}`,
    {}
  );
  const allowLogs = _.get(options, 'logs', true);
  const models = _.get(options, 'models', []);

  const info = (msg) =>
    allowLogs && strapi.log.debug(`[Sync i18n Relations] ${msg}`);

  return {
    initialize() {
      info(`syncing i18n relations for models: [${models.join(', ')}]`);

      const router = new Router();

      // --- Helpers

      /**
       * Get localized ID of a given entity
       *
       * @param {integer} id The entity ID
       * @param {string} locale The 2-digit lang code to test for
       * @return {integer|null} The localized ID or null
       */
      const getI18nId = async (modelName, id, locale) => {
        const results = await strapi.query(modelName).findOne({ id });
        const localizations = results.localizations.filter(
          (x) => x.locale === locale
        );
        const localization = _.first(localizations) || null;
        const lid = localization && localization.id ? localization.id : null;

        return lid;
      };

      /**
       * Gets list of models related to a given model
       *
       * @param {string} model The model used to find related caches to bust
       * @return {array} Array of related models
       */
      const getRelations = (modelName) => {
        const model = strapi.models[modelName];
        const models = Object.assign(
          strapi.models,
          strapi.plugins['users-permissions'].models
        );
        const attributes = _.get(model, 'allAttributes', {});
        const relations = {};

        // first, look for direct relations
        for (const key in attributes) {
          const attr = attributes[key];

          if (
            (!attr.collection && !attr.model) ||
            attr.collection === modelName ||
            attr.model === modelName ||
            key === 'created_by' ||
            key === 'updated_by'
          )
            continue;

          if (attr.collection) {
            relations[key] = models[attr.collection];
          } else if (attr.model && attr.model !== 'file') {
            relations[key] = models[attr.model];
          }
        }

        return relations;
      };

      /**
       * Creates a Koa middleware that syncs relations for a i18nized model
       *
       * @param {string} model
       */
      const sync = (modelName) => async (ctx, next) => {
        const { request } = ctx;
        const { body } = request;

        await next();

        const models = Object.assign(
          strapi.models,
          strapi.plugins['users-permissions'].models
        );
        const relations = getRelations(modelName);
        const entity = await strapi.query(modelName).findOne({ id: body.id });
        const localizations = entity ? entity.localizations : null;

        for (const key in relations) {
          const relation = body[key];

          if (!relations[key]) continue;

          const relationModelName = relations[key].modelName;
          const relationModel = models[relationModelName];
          const hasI18n =
            relationModel &&
            relationModel.pluginOptions &&
            relationModel.pluginOptions.i18n &&
            relationModel.pluginOptions.i18n.localized;

          if (
            typeof relation !== 'undefined' &&
            localizations &&
            relationModel
          ) {
            for (const localization of localizations) {
              const { id, locale } = localization;
              let payload = {};

              if (hasI18n) {
                // collection
                if (Array.isArray(relation)) {
                  const lids = [];

                  for (const _id of relation) {
                    const lid = await getI18nId(relationModelName, _id, locale);

                    if (lid) {
                      lids.push(lid);
                    }
                  }

                  payload[key] = lids;
                  // single item
                } else if (relation) {
                  const lid = await getI18nId(
                    relationModelName,
                    relation,
                    locale
                  );

                  if (lid) {
                    payload[key] = lid;
                  }
                } else {
                  payload[key] = relation;
                }
              } else {
                payload[key] = relation;
              }

              if (payload.hasOwnProperty(key)) {
                await strapi.query(modelName).update({ id }, payload);
              }
            }
          }
        }
      };

      // --- Admin REST endpoints

      /**
       * Syncs relations for specified i18nized models
       *
       * @param {Koa.BaseContext} ctx
       * @param {Function} next
       */
      const synci18nRelations = async (ctx, next) => {
        const i18nEnabled = Object.keys(strapi.plugins).includes('i18n');
        const modelName = _.chain(ctx)
          .get('params.scope')
          .split('.')
          .last()
          .value();
        const model = strapi.models[modelName];
        const hasI18n =
          model &&
          model.pluginOptions &&
          model.pluginOptions.i18n &&
          model.pluginOptions.i18n.localized;

        // bail if i18n plugin is not enabled or model isn't i18nized
        if (!i18nEnabled || !hasI18n) {
          await next();
        } else {
          await sync(modelName)(ctx, next);
        }
      };

      ['collection-types', 'single-types'].forEach((type) => {
        router.post(`/content-manager/${type}/:scope`, synci18nRelations);
        router.post(
          `/content-manager/${type}/:scope/publish/:id*`,
          synci18nRelations
        );
        router.post(
          `/content-manager/${type}/:scope/unpublish/:id*`,
          synci18nRelations
        );
        router.put(`/content-manager/${type}/:scope/:id*`, synci18nRelations);
      });

      strapi.app.use(router.routes());
    },
  };
};

module.exports = Sync;
