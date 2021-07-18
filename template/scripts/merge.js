const path = require('path');
const fs = require('fs');

module.exports = function merge() {
  const filesToMove = [
    {
      oldPath: path.join(__dirname, 'files/.vscode'),
      newPath: path.join(__dirname, 'files/.test')
    }
  ];

  filesToMove.forEach((file) => {
    fs.rename(file.oldPath, file.newPath, (err) => {
      if (err)
        console.log(err);

      console.log(`${path.basename(file.newPath)} successfuly moved.`);
    });
  });
}();