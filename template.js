module.exports = function(scope) {
  return {
    package: {
      config: {
        'principal-strapi-template-basic-version': '2.3.3'
      },
      dependencies: {
        'pg': 'latest',
        'slugify': 'latest',
        'strapi-middleware-cache': 'latest',
        'strapi-plugin-preview-content': 'latest',
        'randomstring': 'latest',
        'strapi-plugin-graphql': scope.strapiVersion,
        'strapi-plugin-documentation': scope.strapiVersion,
        'strapi-provider-email-amazon-ses': scope.strapiVersion,
        'strapi-provider-upload-aws-s3': scope.strapiVersion,
      },
    },
  };
};