'use strict';

const { sanitizeEntity } = require('strapi-utils');
const pluralize = require('pluralize');

/**
 * Populate related entities
 *
 * @param {Object} strapi strapi instance
 * @param {Object=} _options
 * @param {Object} _options.entity
 * @param {string} _options.model
 * @param {string=} _options.dynamicZonePrefix
 * @param {string=} _options.method
 * @param {Object=} _options.params
 * @param {Array=.<string>} _options.where
 * @param {Array=.<string>} _options.populate
 */
module.exports = async (strapi, _options = {}) => {
  const defaults = {
    dynamicZonePrefix: 'body_',
    method: 'find',
  };
  const options = Object.assign({}, defaults, _options);
  const modelPlural = pluralize(options.model);

  if (options.entity) {
    for (const key in options.entity) {
      if (!key.startsWith(options.dynamicZonePrefix)) continue;

      const body = options.entity[key];

      if (Array.isArray(body)) {
        for (const layout of body) {
          if (!options.where.includes(layout.__component)) continue;

          const relatedEntities = layout[modelPlural];

          if (!relatedEntities.length) {
            const _results = await strapi.services[options.model][options.method](options.params, options.populate);
            const results = sanitizeEntity(_results, { model: strapi.models[options.model] });
            const relatedEntities = [];

            for (const item of results) {
              relatedEntities.push({
                [options.model]: item
              });
            }

            if (relatedEntities.length) {
              layout[modelPlural] = relatedEntities;
            }
          }
        }
      }
    }
  }

  return options.entity;
};
