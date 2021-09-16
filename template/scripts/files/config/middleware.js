module.exports = ({ env }) => ({
  load: {
    before: ['responseTime', 'logger', 'cors', 'responses', 'gzip'],
    after: ['parser', 'cache', 'sync-i18n-relations', 'router'],
  },
  settings: {
    cache: {
      enabled: env('CACHE_ENABLED') == 1 ? true : false,
      models: [
        {
          model: 'settings-general',
          singleType: true,
        },
        {
          model: 'settings-sitemap',
          singleType: true,
          maxAge: 86400000 // 24h
        },
      ],
      type: env('CACHE_TYPE'),
      max: parseInt(env('CACHE_MAX')),
      maxAge: parseInt(env('CACHE_MAX_AGE')),
      logs: env('CACHE_LOGS') == 1 ? true : false,
      redisConfig: env('CACHE_REDIS_CONFIG') ? JSON.parse(env('CACHE_REDIS_CONFIG')) : {},
    },
    // TODO: add all models with relations to sync
    'sync-i18n-relations': {
      enabled: true,
      models: ['page'],
    },
  },
});
