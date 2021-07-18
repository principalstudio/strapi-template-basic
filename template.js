module.exports = function(scope) {
  return {
    package: {
      config: {
        'principal-strapi-template-basic-version': '1.0.0'
      },
      dependencies: {
        'strapi-middleware-cache': '1.5.0',
        'strapi-plugin-graphql': scope.strapiVersion,
        'strapi-plugin-documentation': scope.strapiVersion,
        'strapi-provider-email-sendgrid': scope.strapiVersion,
      },
      scripts: {
        postinstall: 'if [ -d ./scripts/files ]; node ./scripts/merge.js'
      }
    },
  };
};