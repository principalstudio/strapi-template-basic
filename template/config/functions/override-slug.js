'use strict';

const slugify = require('slugify');

/**
 * Override slug with slugified string
 *
 * @param {Object} data entity data
 * @param {String} model Strapi model name
 * @param {?String} sourceStr String to slugify, if null data.title is used
 * @param {?String} extraFieldKey Key of an extra field to be set with value to be slugified
 */
module.exports = async (
  data,
  model,
  sourceStr = null,
  extraFieldKey = null
) => {
  const isPublishing =
    data.hasOwnProperty('published_at') && Object.keys(data).length === 1;

  if (isPublishing) return;

  const toSlugify = sourceStr ? sourceStr : data.title;
  let slug = slugify(toSlugify, {
    lower: true,
    strict: true,
  });
  const countParams = { slug };

  if (data.id) {
    countParams.id_nin = [data.id];
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
};
