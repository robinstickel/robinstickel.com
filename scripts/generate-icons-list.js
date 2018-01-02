export default function() {
  return new Promise((resolve, reject) => {
    const fs = require('fs');

    fs.readdir('./dist/img/icons', function(err, files) {
      const logger = fs.createWriteStream('./dist/icons.php', {
        flags: 'w' // 'a' means appending (old data will be preserved)
      });
      logger.write(`<?php\n\n`);

      let i = 0;
      files.forEach((file, index) => {
        const extPos = file.search(/\.[^.\s]{3,15}$/);
        let name = file.slice(0, extPos);
        const ext = file.slice(extPos + 1);
        name = name.replace(/-/g, '_');

        if (ext === 'svg') {
          fs.readFile(`./dist/img/icons/${file}`, 'utf-8', function(err, contents) {
            logger.write(`$icon_${name} = '${contents}';\n\n`);
            i += 1;
            if (i === files.length) {
              logger.end();
              resolve();
            }
          });
        }
      });
    });
  });
}
