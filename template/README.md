
# [project name]

[![Automated Release Notes by gren](https://img.shields.io/badge/%F0%9F%A4%96-release%20notes-00B2EE.svg)](https://github-tools.github.io/github-release-notes/)

Strapi API/CMS for [project name]

## API/CMS configuration and deployment

### TODOs

There are TODOs across the files in this project. Make sure to follow instructions in each of them and delete the TODO once it has been applied.

### Strapi documentation and guides

Refer to the [Strapi documentation](https://strapi.io/documentation/v3.x/getting-started/introduction.html) to setup, configure and deploy the Strapi app.

### Conventional field naming

Dynamic zones containing layouts components should be named `body`. SEO fields for content type entries should use the _seo_ component with the name `meta`.

### Permissions and content type / component views

When all the content types and components are created and set up, make sure to set roles and permissions for each of content type and test the API calls. Also make sure to configure each view with appropriate labels, descriptions ans placeholders.

After the above is completed run `npm run strapi config:dump -- -f dump.json` to dump all configurations that are saved to the database. When deploying a new instance of Strapi, these same configurations can be replicated in the instance’s database by running `npm run strapi config:restore -- -f dump.json`.

### Sitemap

To define which models should have their entities listed in the sitemap, add their keys to the `models` array in the _api/settings-sitemap/controllers/settings-sitemap.js_ file.

### Cache

[strapi-middleware-cache](https://github.com/patrixr/strapi-middleware-cache) is used to provide simple (dumb) caching via mem or Redis. Content relationships aren’t taken into account when the cache is busted. Cache busting happens when a PUT, POST or DELETE request comes in and affects the resource only. Models to be cached need to be defined in the _config/middleware.js_ file. Cache settings are defined via environment variables in AWS.

### Deployment

Deployements to AWS Elastic Beanstalk are handled by the _.github/workflows/deploy-main.yml_ workflow. Refer to this file for more info.
