const path = require('path');
const fs = require('fs');

module.exports = function merge() {
  const filesToMove = [
    {
      oldPath: path.join(__dirname, 'files/.vscode.example'),
      newPath: path.join(__dirname, '../.vscode')
    },
    {
      oldPath: path.join(__dirname, 'files/.github'),
      newPath: path.join(__dirname, '../.github')
    },
    {
      oldPath: path.join(__dirname, 'files/.dockerignore'),
      newPath: path.join(__dirname, '../.dockerignore')
    },
    {
      oldPath: path.join(__dirname, 'files/config/middleware.js'),
      newPath: path.join(__dirname, '../config/middleware.js')
    },
    {
      oldPath: path.join(__dirname, 'files/config/plugins.js'),
      newPath: path.join(__dirname, '../config/plugins.js')
    },
    {
      oldPath: path.join(__dirname, 'files/config/env/production/server.js'),
      newPath: path.join(__dirname, '../config/env/production/server.js')
    },
    {
      oldPath: path.join(__dirname, 'files/config/env/production/database.js'),
      newPath: path.join(__dirname, '../config/env/production/database.js')
    },
    {
      oldPath: path.join(__dirname, 'files/extensions/documentation/config'),
      newPath: path.join(__dirname, '../extensions/documentation/config')
    },
    {
      oldPath: path.join(__dirname, 'files/extensions/content-manager'),
      newPath: path.join(__dirname, '../extensions/content-manager')
    },
    {
      oldPath: path.join(__dirname, 'files/extensions/i18n'),
      newPath: path.join(__dirname, '../extensions/i18n')
    },
    {
      oldPath: path.join(__dirname, 'files/extensions/users-permissions/config/routes.json'),
      newPath: path.join(__dirname, '../extensions/users-permissions/config/routes.json')
    },
    {
      oldPath: path.join(__dirname, 'files/extensions/users-permissions/config/security.json'),
      newPath: path.join(__dirname, '../extensions/users-permissions/config/security.json')
    },
    {
      oldPath: path.join(__dirname, 'files/extensions/users-permissions/controllers'),
      newPath: path.join(__dirname, '../extensions/users-permissions/controllers')
    },
    {
      oldPath: path.join(__dirname, 'files/middlewares'),
      newPath: path.join(__dirname, '../middlewares')
    },
    {
      oldPath: path.join(__dirname, 'files/.grenrc.yml'),
      newPath: path.join(__dirname, '../.grenrc.yml')
    },
    {
      oldPath: path.join(__dirname, 'files/docker-compose.yml.example'),
      newPath: path.join(__dirname, '../docker-compose.yml.example')
    },
    {
      oldPath: path.join(__dirname, 'files/Dockerfile'),
      newPath: path.join(__dirname, '../Dockerfile')
    },
    {
      oldPath: path.join(__dirname, 'files/LICENCE.txt'),
      newPath: path.join(__dirname, '../LICENCE.txt')
    },
  ];

  fs.mkdirSync(path.join(__dirname, '../extensions/documentation/config'), { recursive: true });
  fs.mkdirSync(path.join(__dirname, '../config/env/production'), { recursive: true });

  filesToMove.forEach((file) => {
    fs.rename(file.oldPath, file.newPath, (err) => {
      if (err) {
        throw err;
      } else {
        console.log(`${path.basename(file.newPath)} successfuly moved.`);
      }
    });
  });

  // remove whole scripts directory
  fs.rmdirSync(__dirname, { recursive: true });
}();