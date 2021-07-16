'use strict';

const _ = require('lodash');

function packageSitemapEntity(_entity, contentType) {
  const entity = {
    type: _entity.article_type || contentType
  };
  const slugKeys = Object.keys(_entity).filter(x => x.startsWith('slug'));

  for (const key of slugKeys) {
    entity[key] = _entity[key];
  }

  return entity;
}

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  /**
   * Serve sitemap.
   *
   * @return {Array}
   */
  async getSitemap(ctx) {
    let entities = [];
    const models = [
      // TODO: add model names here
    ];

    for (const model of models) {
      const attributes = strapi.models[model].allAttributes;
      const params = {
        _limit: -1,
        _publicationState: 'live',
      };

      if (attributes.excluded_from_sitemap) {
        params.excluded_from_sitemap_ne = true;
      }

      let _items = await strapi.query(model).find(params, ['no']);
      const items = _items.map(entity => packageSitemapEntity(entity, model));
      entities = entities.concat(items);
    }

    return entities;
  },
};
