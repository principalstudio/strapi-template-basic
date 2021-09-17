module.exports = function(scope) {
  return {
    package: {
      config: {
        'principal-strapi-template-basic-version': '1.2.4'
      },
      dependencies: {
        'pg': 'latest',
        'slugify': 'latest',
        'strapi-middleware-cache': 'latest',
        'randomstring': 'latest',
        'strapi-plugin-graphql': scope.strapiVersion,
        'strapi-plugin-documentation': scope.strapiVersion,
        'strapi-provider-email-sendgrid': scope.strapiVersion,
      },
    },
  };
};