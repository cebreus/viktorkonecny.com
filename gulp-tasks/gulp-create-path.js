const fs = require('fs');
const path = require('path');

/**
 * @description Check if there is version in another language and if it is then add cannonical into json
 * @param {string} input Path to dir with source files
 * @param {callback} callback
 * @param {string} lang  code for lang
 * @return {stream} Processed file
 */

const createPaths = (input, callback, type = 'cs') => {
  const files = fs.readdirSync(input, 'utf-8');

  files.forEach((file) => {
    const parsed = JSON.parse(
      fs.readFileSync(`${process.cwd()}/${input}/${file}`, 'utf-8')
    );

    const slug = parsed.seo.slug || path.parse(file).name.replace(/\\/g, '/');

    parsed.path = `blog/${slug}`;

    fs.writeFileSync(
      `${process.cwd()}/${input}/${file}`,
      JSON.stringify(parsed)
    );
  });

  callback();
};

module.exports = createPaths;
