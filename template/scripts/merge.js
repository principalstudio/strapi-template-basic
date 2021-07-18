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
      oldPath: path.join(__dirname, 'files/config/middleware.js'),
      newPath: path.join(__dirname, '../config/middleware.js')
    },
    {
      oldPath: path.join(__dirname, 'files/config/plugins.js'),
      newPath: path.join(__dirname, '../config/plugins.js')
    },
    {
      oldPath: path.join(__dirname, 'files/config/server.js'),
      newPath: path.join(__dirname, '../config/server.js.example')
    },
    {
      oldPath: path.join(__dirname, 'files/extensions'),
      newPath: path.join(__dirname, '../extensions')
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
  ];

  filesToMove.forEach((file) => {
    fs.rename(file.oldPath, file.newPath, (err) => {
      if (err) {
        throw err;
      } else {
        console.log(`${path.basename(file.newPath)} successfuly moved.`);
      }
    });
  });

  fs.rmdir(__dirname, function(err) {
    if (err) {
      throw err;
    } else {
      console.log('scripts directory successfuly removed.');
    }
  });
}();