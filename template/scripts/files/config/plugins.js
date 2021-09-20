module.exports = ({ env }) => ({
  // TODO: Remove/edit depending on needs
  // upload: {
  //   breakpoints: {
  //     xlarge: 1920,
  //     large: 1280,
  //     medium: 1024,
  //     small: 600,
  //     xsmall: 300
  //   }
  // },
  email: {
    provider: 'amazon-ses',
    providerOptions: {
      key: env('AWS_SES_KEY'),
      secret: env('AWS_SES_SECRET'),
      amazon: `https://email.${env('AWS_REGION')}.amazonaws.com`,
    },
    settings: {
      defaultFrom: env('EMAIL_DEFAULT_FROM'),
      defaultReplyTo: env('EMAIL_DEFAULT_REPLY_TO'),
    },
  },
});
