'use strict';

/**
 * Filter field keys
 *
 * @param {Object} item strapi query entity
 * @param {Array.<string>} keys list of keeps to filter
 * @param {string} childKey
 * @param {Boolean} keysStartWith
 * @return {Array.<string>} filtered keys
 */
function filterKeys(_item, keys, childKey, keysStartWith) {
  const item = Array.isArray(_item) ? _item[0] : _item;

  if (!item) return [];

  return Object.keys(item).filter(
    x => {
      for (const _key of keys) {
        const key = childKey ? childKey : _key;
        const check = keysStartWith ? x.startsWith(key) : x === key;

        if (check || x === 'id') {
          return x;
        }
      }
    }
  );
}

/**
 * Build item summary
 *
 * @param {Object} item strapi query entity
 * @param {Array.<string>} keys list of keys representing fields to keep in summary
 * @param {Boolean} keysStartWith look for keys that start with or just use as is
 * @return {Object} summary
 */
module.exports = async (item, keys, keysStartWith = false) => {
  const firstLevelKeys = keys.filter(x => !x.includes('.'));
  const secondLevelKeys = keys.filter(x => x.split('.').length === 2);
  const keysToKeep = {
    _: filterKeys(item, firstLevelKeys, null, keysStartWith)
  }

  for (const _key of secondLevelKeys) {
    const keyParts = _key.split('.');
    const parentKey = keyParts[0];
    const key = keyParts[1];

    if (item[parentKey]) {
      if (!Array.isArray(keysToKeep[parentKey])) {
        keysToKeep[parentKey] = [];
      }

      keysToKeep[parentKey] = Array.from(new Set([
        ...keysToKeep[parentKey],
        ...filterKeys(item[parentKey], secondLevelKeys, key, keysStartWith)
      ]));
    }
  }

  // loop through item and delete unwanted fields
  for (const key of Object.keys(item)) {
    if (item.hasOwnProperty(key) && !keysToKeep._.includes(key)) {
      delete item[key];
    }
  }

  // loop through relations in item and delete unwanted fields
  for (const groupKey in keysToKeep) {
    if (groupKey === '_') continue;

    if (item.hasOwnProperty(groupKey)) {
      const _items = item[groupKey];
      const items = Array.isArray(_items) ? _items : [_items];

      for (const obj of items) {
        for (const key of Object.keys(obj)) {
          if (obj.hasOwnProperty(key) && !keysToKeep[groupKey].includes(key)) {
            delete obj[key];
          }
        }
      }
    }
  }

  return item;
};
