module.exports = ({ env }) => ({
  upload: {
    breakpoints: {
      xlarge: 1920,
      large: 1280,
      medium: 1024,
      small: 600,
      xsmall: 300
    }
  },
  // email: {
  //   provider: 'sendgrid',
  //   providerOptions: {
  //     apiKey: env('SENDGRID_API_KEY'),
  //   },
  //   settings: {
  //     defaultFrom: env('SENDGRID_EMAIL_FROM'),
  //     defaultReplyTo: env('SENDGRID_EMAIL_FROM'),
  //   },
  // },
});
