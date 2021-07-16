'use strict';

const pluralize = require('pluralize');

/**
 * parse dynamic zone relations and/or components even if burried deeper than strapi permits
 *
 * @param {Object} strapi                                Strapi instance
 * @param {Object} options
 * @param {string} options.dynamicZonePrefix             Name of targeted layout name prefix
 * @param {string} options.model                         Name of targeted model
 * @param {Object} options.entity                        Strapi query entity
 * @param {Boolean=} options.queryRelations              Query database to retrieve full entity or use as is (defaults to false)
 * @param {Boolean=} options.summarize                   Summarize the linked entities or not
 * @param {Array=.<string>} options.summarizeWhere       Where to summarize the linked entities (in which dynamic zone components)
 * @param {Array.<string|Object>} options.summaryKeys    Which field keys to use to populate the linked entity summaries.
 *                                                       Use objects {key: 'key', where: ['parent_component_key']} to include field
 *                                                       key in specific dynamic zone components
 * @param {Array=.<string|Object>} options.componentKeys Array of strings or objects {key: 'key', where: ['parent_component_key'],
 *                                                       summarize: true, summaryKeys: ['slug_']}. Typically, use only if linked
 *                                                       entities aren't summarized. A known use case is when Strapi removes deep
 *                                                       nested components, this will populate the nested components.
 * @param {Boolean} options.keysStartWith                Look for keys that start with or just use as is
 * @returns {Object} updated strapi query entity
 */
module.exports = async (strapi, options = {
    dynamicZonePrefix,
    model,
    entity,
    queryRelations,
    summarize,
    summarizeWhere,
    summaryKeys,
    componentKeys,
    keysStartWith,
  }) => {
  const layoutKeys = Object.keys(options.entity).filter(x => x.startsWith(options.dynamicZonePrefix));
  const queries = {};
  queries[options.model] = {};

  for (const _key of layoutKeys) {
    const layouts = options.entity[_key];

    if (!Array.isArray(layouts)) continue;

    for (const layout of layouts) {

      // we assume the model name is used as the relation field name
      const modelPlural = pluralize(options.model);
      const hasMultipleItems = Array.isArray(layout[modelPlural]);
      const items = hasMultipleItems ? layout[modelPlural] : [layout[options.model]];

      if (!hasMultipleItems && !layout[options.model]) continue;

      for (let el of items) {
        const item = el[options.model] ? el[options.model] : el;
        let _item;

        if (!item || (item && !item.id)) continue;

        if (queries[options.model][item.id]) {
          _item = queries[options.model][item.id];
        } else {
          if (options.queryRelations === false) {
            _item = item;
          } else {
            _item = await strapi.query(options.model).findOne({ id: item.id });
          }
          Object.assign(queries[options.model], { [item.id]: _item });
        }

        // we either summarize the entity, or populate its components/relations (which can also be summarized)
        if (_item && options.summarize && Array.isArray(options.summaryKeys)) {
          const summaryKeys = options.summaryKeys.flatMap(_key => {
            const key = _key.key ? _key.key : _key;

            if ((Array.isArray(_key.where) && _key.where.includes(layout.__component)) || (!Array.isArray(_key.where))) {
              return key;
            } else {
              return [];
            }
          });

          if ((Array.isArray(options.summarizeWhere) && options.summarizeWhere.includes(layout.__component)) || (!Array.isArray(options.summarizeWhere))) {
            const summary = await strapi.config.functions['summarize']({..._item}, summaryKeys, options.keysStartWith);

            if (hasMultipleItems) {
              el[options.model] = summary;
            } else {
              layout[options.model] = await strapi.config.functions['summarize']({..._item}, summaryKeys, options.keysStartWith);
            }
          }
        } else if (_item && Array.isArray(options.componentKeys)) {
          for (const _component of options.componentKeys) {
            const compKey = _component.key ? _component.key : _component;
            const components = options.keysStartWith ? Object.keys(_item).filter(x => x.startsWith(compKey)) : compKey;

            for (const component of components) {
              if (component in _item) {
                if (_component.summarize && Array.isArray(_component.summaryKeys)) {
                  _item[component] = await strapi.config.functions['summarize'](_item[component], _component.summaryKeys, options.keysStartWith);
                }

                if ((Array.isArray(_component.where) && _component.where.includes(layout.__component)) || (!Array.isArray(_component.where))) {
                  item[component] = _item[component];
                }
              }
            }
          }
        }
      }
    }
  }

  return options.entity;
};
