module.exports = function(scope) {
  return {
    package: {
      config: {
        'principal-strapi-template-basic-version': '1.1.0'
      },
      dependencies: {
        'slugify': 'latest',
        'strapi-middleware-cache': 'latest',
        'strapi-plugin-graphql': scope.strapiVersion,
        'strapi-plugin-documentation': scope.strapiVersion,
        'strapi-provider-email-sendgrid': scope.strapiVersion,
      },
    },
  };
};