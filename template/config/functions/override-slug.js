'use strict';

const slugify = require('slugify');

/**
 * Override slug with slugified string
 *
 * Usage (in model .js file):
 *
 * lifecycles: {
 *   async beforeCreate(data) {
 *     data = await strapi.config.functions['override-slug'](data, 'page');
 *   },
 *   async beforeUpdate(params, data) {
 *     data = await strapi.config.functions['override-slug'](data, 'page', params);
 *   },
 * },
 *
 * @param {Object} data entity data
 * @param {String} model Strapi model name
 * @param {?Object} params strapi query params
 * @param {?String} sourceStr String to slugify, if null data.title is used
 * @param {?String} extraFieldKey Key of an extra field to be set with value to be slugified
 */
module.exports = async (data, model, params = null, sourceStr = null, extraFieldKey = null) => {
  const isPublishing = data.hasOwnProperty('published_at') && Object.keys(data).length === 1;
  const toSlugify = sourceStr ? sourceStr : data.title;

  // bail if entity is being published or unpublished
  if (isPublishing || !toSlugify) return data;

  const id = params && params.id ? params.id : data.id;
  let locale;

  if (data.locale) {
    locale = data.locale;
  } else {
    const entity = await strapi.query(model).findOne({ id });
    locale = entity.locale;
  }

  let slug = slugify(toSlugify, {
    lower: true,
    strict: true,
  });
  const countParams = { slug, _locale: locale };

  if (id) {
    countParams.id_nin = [id];
  }

  const slugCount = await strapi.query(model).count(countParams);

  // if slug already exists, add a count
  if (slugCount) {
    slug += `-${(slugCount + 1).toString()}`;
  }

  if (extraFieldKey) {
    data[extraFieldKey] = toSlugify;
  }

  data.slug = slug;

  return data;
};
