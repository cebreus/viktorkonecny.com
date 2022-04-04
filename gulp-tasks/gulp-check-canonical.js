const fs = require('fs');
const path = require('path');

/**
 * @description Check if there is version in another language and if it is then add canonical into json
 * @param {string} inputFirstVersion Path with filter to source files
 * @param {string} inputSecondVersion Path with filter to source files
 * @return {stream} Processed file
 */

const checkCanonical = (inputDirCs, inputDirEn, callback) => {
  const csFiles = fs.readdirSync(inputDirCs, 'utf-8');

  csFiles.forEach((file) => {
    try {
      const fileCs = JSON.parse(
        fs.readFileSync(`${process.cwd()}/${inputDirCs}/${file}`, 'utf-8')
      );

      if (
        path
          .parse(`${process.cwd()}/${inputDirCs}/${file}`)
          .dir.endsWith('_dataset-koncerty')
      ) {
        fileCs.seo.canonical_self = `/koncerty/${
          path.parse(`${process.cwd()}/${inputDirCs}/${file}`).name
        }/`;
      } else {
        fileCs.seo.canonical_self = `/${
          path.parse(`${process.cwd()}/${inputDirCs}/${file}`).name
        }/`;
      }

      let fileEn;

      try {
        fileEn = JSON.parse(
          fs.readFileSync(`${process.cwd()}/${inputDirEn}/${file}`, 'utf-8')
        );

        if (fileCs.lang_pair_id === fileEn.lang_pair_id) {
          fileCs.seo.useCanonicalLang = true;
          fileEn.seo.useCanonicalLang = true;

          fileCs.seo.canonical_self = fileEn.seo.canonical_cs;
          fileEn.seo.canonical_self = fileCs.seo.canonical_en;
        } else {
          fileCs.seo.useCanonicalLang = false;
          fileEn.seo.useCanonicalLang = false;
        }
      } catch (error) {
        console.log('\x1b[33m⬆️ File in EN version doesn’t exists\x1b[0m');
      }

      fs.writeFileSync(
        `${process.cwd()}/${inputDirCs}/${file}`,
        JSON.stringify(fileCs)
      );

      fs.writeFileSync(
        `${process.cwd()}/${inputDirEn}/${file}`,
        JSON.stringify(fileEn)
      );
    } catch (error) {
      console.log('\x1b[33m⬆️ File in CS version doesn’t exists\x1b[0m');
    }
  });

  callback();
};

module.exports = checkCanonical;
