/* eslint-disable no-process-exit */
/* eslint-disable no-console */

const {run, semtag} = require('./utils');
const {version} = require('../package.json');

(async() => {
  const tags = (await run('npm dist-tag ls')).split('\n').reduce((acc, line) => {
    const matches = (/^([^:]+): (.+)$/).exec(line);
    acc[matches[1]] = matches[2];
    return acc;
  }, {});

  const tag = semtag(tags, version);

  console.info(`Publishing version ${version} (@${tag})`);

  await run(`npm publish --tag ${tag}`);

})().catch((error) => {
  console.error(`Failed to publish to npm: ${error.message || error}.`);
  process.exit(1);
});
