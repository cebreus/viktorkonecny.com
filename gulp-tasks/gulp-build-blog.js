const fs = require('fs');
const { parse } = require('path');
const { clearConfigCache } = require('prettier');

const buildBlog = (input, output) => {
  return fs.readFile(input, 'utf8', (err, file) => {
    let parsed = JSON.parse(file);
    const limit = parsed['SITE']['blogPaginateLimit'];
    parsed['BLOG'] = parsed['BLOG'].sort(
      (a, b) =>
        new Date(b['entity_status'].date) - new Date(a['entity_status'].date)
    );
    if (parsed['BLOG'].length > limit) {
      const loops = Math.ceil(parsed['BLOG'].length / limit);
      let start = 0;
      let end = limit;

      for (let index = 0; index < loops; index++) {
        let splitFile = {
          active: index,
          title: `Titulek - stránka č. ${index + 1}`,
          description: `Description - stranka c. ${index + 1}`,
        };
        splitFile['PAGINATE'] = parsed['BLOG'].slice(start, end);

        if (!fs.existsSync(output)) {
          fs.mkdirSync(output);
        }

        fs.writeFile(
          `${output}/${index}.json`,
          JSON.stringify(splitFile),
          (err) => {
            if (err) {
              throw new Error(err);
            }
          }
        );

        start += limit;
        end += limit;
      }
    }
  });
};

module.exports = buildBlog;
