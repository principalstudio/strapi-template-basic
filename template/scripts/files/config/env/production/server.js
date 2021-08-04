module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  url: env('URL', null),
  admin: {
    // TODO: run command bellow
    url: '/<run `openssl rand 10 -hex` until the string starts with a letter>',
    auth: {
      secret: env('ADMIN_JWT_SECRET'),
    },
  },
});
