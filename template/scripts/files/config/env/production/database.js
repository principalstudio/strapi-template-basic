module.exports = ({ env }) => ({
  defaultConnection: 'default',
  connections: {
    default: {
      connector: 'bookshelf',
      settings: {
        client: 'postgres',
        host: env('DATABASE_HOST', process.env.RDS_HOSTNAME),
        port: env.int('DATABASE_PORT', process.env.RDS_PORT),
        database: env('DATABASE_NAME', process.env.RDS_DB_NAME),
        username: env('DATABASE_USERNAME', process.env.RDS_USERNAME),
        password: env('DATABASE_PASSWORD', process.env.RDS_PASSWORD),
        ssl: env.bool('DATABASE_SSL', false),
      },
      options: {
        pool: {
          min: 0,
          max: 10,
          idleTimeoutMillis: 30000,
          createTimeoutMillis: 30000,
          acquireTimeoutMillis: 30000,
        },
      },
    },
  },
});
