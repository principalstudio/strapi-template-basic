module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  url: env('URL', null),
  admin: {
    url: '/<run `openssl rand 10 -hex` until the string starts with a letter>',
    watchIgnoreFiles: ['/srv/app/api-calls.paw'],
    auth: {
      secret: env('ADMIN_JWT_SECRET'),
    },
  },
});
