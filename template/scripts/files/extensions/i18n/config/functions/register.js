'use strict';

const _ = require('lodash');
const { PUBLISHED_AT_ATTRIBUTE } = require('strapi-utils').contentTypes.constants;

const { getService } = require('../../../../node_modules/strapi-plugin-i18n/utils');
const fieldMigration = require('../../../../node_modules/strapi-plugin-i18n/config/functions/migrations/field');
const enableContentTypeMigration = require('../../../../node_modules/strapi-plugin-i18n/config/functions/migrations/content-type/enable');
const disableContentTypeMigration = require('../../../../node_modules/strapi-plugin-i18n/config/functions/migrations/content-type/disable');

module.exports = () => {
  const contentTypeService = getService('content-types');
  const coreApiService = getService('core-api');

  _.set(strapi.plugins.i18n.config, 'schema.graphql', {});

  Object.values(strapi.contentTypes).forEach(contentType => {
    if (contentTypeService.isLocalizedContentType(contentType)) {
      const { attributes, modelName } = contentType;

      _.set(attributes, 'localizations', {
        writable: true,
        private: false,
        configurable: false,
        visible: false,
        collection: modelName,
        populate: ['_id', 'id', 'slug', 'locale', PUBLISHED_AT_ATTRIBUTE], // Add slug to localizations object
      });

      _.set(attributes, 'locale', {
        writable: true,
        private: false,
        configurable: false,
        visible: false,
        type: 'string',
      });

      coreApiService.addCreateLocalizationAction(contentType);
      coreApiService.addGraphqlLocalizationAction(contentType);
    }
  });

  strapi.db.migrations.register(fieldMigration);
  strapi.db.migrations.register(enableContentTypeMigration);
  strapi.db.migrations.register(disableContentTypeMigration);
};
