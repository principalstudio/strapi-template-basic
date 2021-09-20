// TODO: Run merge script: `node scripts/merge.js`
// TODO: Create a git repo and push all files/directories
// TODO: Update documentation config in extensions/documentation/config/settings.json

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
        'strapi-provider-email-amazon-ses': scope.strapiVersion,
        'strapi-provider-upload-aws-s3': scope.strapiVersion,
      },
    },
  };
};