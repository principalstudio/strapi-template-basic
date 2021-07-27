'use strict';

const slugify = require('slugify');

/**
 * Override slug with slugified title
 *
 * @param {Object} data entity data
 * @param {String} titleKey title key (default: 'title')
 * @return {Object} entity data
 */
module.exports = async (data, titleKey = 'title') => {
  if (data[titleKey]) {
    data.slug = slugify(data[titleKey], { lower: true, strict: true });
  }
}
