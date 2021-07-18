
# [project name]

[![Automated Release Notes by gren](https://img.shields.io/badge/%F0%9F%A4%96-release%20notes-00B2EE.svg)](https://github-tools.github.io/github-release-notes/)

Strapi API/CMS for [project name]

- [[project name]](#project-name)
  - [API/CMS configuration and deployment](#apicms-configuration-and-deployment)
    - [Strapi documentation and guides](#strapi-documentation-and-guides)
    - [Conventional field naming](#conventional-field-naming)
    - [Permissions and content type / component views](#permissions-and-content-type--component-views)
    - [Roles & Permissions](#roles--permissions)
    - [Sitemap](#sitemap)
    - [Cache](#cache)
    - [Emails](#emails)
    - [Uploads](#uploads)
    - [Deployment](#deployment)
  - [Testing API calls](#testing-api-calls)
  - [Migration between environements](#migration-between-environements)
    - [Create a database dump file](#create-a-database-dump-file)
    - [Create a postgres role in production environment](#create-a-postgres-role-in-production-environment)
    - [Create a database in production environment](#create-a-database-in-production-environment)
    - [Import content from databse dump](#import-content-from-databse-dump)
    - [Enable remote connections to database](#enable-remote-connections-to-database)
    - [Whitelist connections to 5432 from docker containers in UFW](#whitelist-connections-to-5432-from-docker-containers-in-ufw)
    - [Instruct docker to use the 172.18.0.0/16 subnet when it creates networks](#instruct-docker-to-use-the-172180016-subnet-when-it-creates-networks)
    - [Grant docker access to GitHub packages](#grant-docker-access-to-github-packages)
    - [docker-compose](#docker-compose)

## API/CMS configuration and deployment

### TODOs

There are TODOs across the files in this project. Make sure to follow instructions in each of them and delete the TODO once it has been applied.
### Strapi documentation and guides

Refer to the [Strapi documentation](https://strapi.io/documentation/v3.x/getting-started/introduction.html) to setup, configure and deploy the Strapi app.

### Conventional field naming

The [principal-express-js-boilerplate](https://github.com/principalstudio/principal-express-js-boilerplate) expects the API response fields to have a specific structure. Dynamic zones containing layouts components should be named using this pattern `body_{langcode}`. Same for titles (`title_{langcode}`) and page headers (`page_header_{langcode}`). SEO fields for content type entries should use the _seo_ component with the name `meta`.

### Permissions and content type / component views

When all the content types and components are created and set up, make sure to set roles and permissions for each of content type and test the API calls via the included paw file. Also make sure to configure each view with appropriate labels, descriptions ans placeholders.

After the above is completed. Log into the docker image by running `docker exec -it <container name> sh`. When logged into the container, run `strapi config:dump -f dump.json` to dump all configurations that are saved to the database. When deploying a new instance of Strapi, these same configurations can be replicated in the instance’s database by running `strapi config:restore -f dump.json`.

### Roles & Permissions

The Roles & Permissions plugin needs to be configured, by default all endpoints access is blocked.

### Sitemap

To define which models should have their entities listed in the sitemap, add their keys to the `models` array in the _api/settings-sitemap/controllers/settings-sitemap.js_ file.

### Cache

[strapi-middleware-cache](https://github.com/patrixr/strapi-middleware-cache) is used to provide simple (dumb) caching via mem or Redis. Content relationships aren’t taken into account when the cache is busted. Cache busting happens when a PUT, POST or DELETE request comes in and affects the resource only. Models to be cached need to be defined in the _config/middleware.js_ file. Cache settings are defined in the docker-compose.yml files.

### Emails

System emails are sent via sendmail by default. To enable Sendgrid, add the credentials in the docker-compose.yml file used to deploy Strapi and uncomment the `email` object in the _config/plugins.js_ file.

### Uploads

By default uploads are stored locally in the _public/uploads_ directory via [strapi-plugin-upload](https://github.com/strapi/strapi/tree/master/packages/strapi-plugin-upload). [Third party providers can be used instead](https://strapi.io/documentation/3.0.0-beta.x/plugins/upload.html#using-a-provider).

If using nginx in front of the Strapi app, make sure it is configured to allow large attachments to be uploaded. Look for the `client_max_body_size` rule in _/etc/nginx/nginx.conf_. Add it if not present, with something like `client_max_body_size 20M;` depending on needs.

Repsonsive images are automatically generated when the _Enable responsive friendly upload_ option is enabled in the Media Library settings. At the moment the intermidiate sizes are hard coded. Alternativelly the following plugins can be used to handle responsive images sizes with more control:

- [strapi-plugin-responsive-image](https://github.com/nicolashmln/strapi-plugin-responsive-image)
- [strapi-plugin-images](https://github.com/Froelund/strapi-plugin-images)

### Deployment

Example docker-compose files are provided in the _docker_ directory. To build and publish a docker image every time commits are pushed to master, rename _.github/workflows/publish-image.yml.off_ -> _.github/workflows/publish-image.yml_.

For more info on Strapi docker images see [https://github.com/strapi/strapi-docker](https://github.com/strapi/strapi-docker).

For more info on various ways to deploy Strapi see the [Strapi documentation](https://strapi.io/documentation/v3.x/getting-started/deployment.html#hosting-provider-guides).

## Testing API calls

Use the [documentation plugin](https://strapi.io/documentation/v3.x/plugins/documentation.html) to test API calls.

## Migration between environements

When in production, we recommand creating a database on the host machine to which Strapi will connect from inside a docker container (see _docker/docker-compose-prod.yml.conf_). Follow these steps to enable connections to postgres from a docker container.

### Create a database dump file

```shell
sudo -u postgres pg_dump <put database name here> > ~/<put database name here>-$(date '+%Y-%m-%d').sql
```

from a docker container:

```shell
docker exec -i <put database user here> pg_dump --username <put database role here> <put database name here> > <put database name here>-$(date '+%Y-%m-%d').sql
```

### Create a postgres role in production environment

```shell
sudo -u postgres psql
CREATE USER <put prod database user here> WITH PASSWORD '<put prod database user password here>';
```

### Create a database in production environment

```shell
sudo -u postgres createdb <put prod database name here> -O <put prod database user here>
```

### Import content from databse dump

Note: make sure the import goes as planned, staging table owner might need to be replaced with prod role in the dump file.

```shell
sudo -u postgres psql <put prod database name here> < <put dump file path here>
```

### Enable remote connections to database

```shell
sudo vi /etc/postgresql/12/main/postgresql.conf

# Add the following line:
listen_addresses = '*'
```

```shell
sudo vi /etc/postgresql/12/main/pg_hba.conf

# Add the following line:
host    all             all             172.18.0.0/16           md5
```

```shell
sudo service postgresql restart
sudo service postgresql@12-main restart
```

### Whitelist connections to 5432 from docker containers in UFW

```shell
sudo ufw allow from 172.18.0.0/16 to any port 5432
sudo ufw reload
```

### Instruct docker to use the 172.18.0.0/16 subnet when it creates networks

```shell
sudo vi /etc/docker/daemon.json
```

Add this content:

```json
{
  "default-address-pools": [
    {
      "base": "172.18.0.0/16",
      "size": 24
    }
  ]
}
```

Restart the docker daemon:

```shell
sudo service docker restart
```

### Grant docker access to GitHub packages

Follow steps [here](https://docs.github.com/en/free-pro-team@latest/packages/using-github-packages-with-your-projects-ecosystem/configuring-docker-for-use-with-github-packages).

### docker-compose

Make sure the proper database cretentials are set in the _docker-compose.yml_ file (database name, database user, database host, database port).

Start the containers:

```shell
docker-compose up -d
```