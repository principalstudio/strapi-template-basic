module.exports = ({ env }) => ({
  // TODO: Eedit depending on needs. To disable breakpoints, use {} as its value
  upload: {
    breakpoints: {
      xlarge: 1920,
      large: 1280,
      medium: 1024,
      small: 600,
      xsmall: 300
    }
  },
  email: {
    provider: 'amazon-ses',
    providerOptions: {
      key: env('AWS_ACCESS_KEY_ID'),
      secret: env('AWS_ACCESS_SECRET'),
      amazon: `https://email.${env('AWS_REGION')}.amazonaws.com`,
    },
    settings: {
      defaultFrom: env('EMAIL_DEFAULT_FROM'),
      defaultReplyTo: env('EMAIL_DEFAULT_REPLY_TO'),
    },
  },
});
