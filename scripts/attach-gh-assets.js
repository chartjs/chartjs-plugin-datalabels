// https://hub.github.com/hub-release.1.html
// https://cli.github.com/manual/
/* eslint-disable no-process-exit */

const {run} = require('./utils');
const pkg = require('../package.json');

const TAG = `v${pkg.version}`;

const ASSETS = [
  `dist/${pkg.name}.js`,
  `dist/${pkg.name}.min.js`,
  `dist/${pkg.name}.esm.js`,
  `dist/${pkg.name}.tgz`,
  `dist/${pkg.name}.zip`,
];

(async() => {
  if (!process.env.GITHUB_TOKEN) {
    throw new Error('GITHUB_TOKEN environment variable required');
  }
  if ((await run(`hub release show ${TAG} -f "%T: %S"`)) !== `${TAG}: draft`) {
    throw new Error(`Release ${TAG} has already been published.`);
  }

  // Attach assets to the associated GitHub release.
  // Note that the `hub release edit -a ${ASSETS.join(' -a ')} -m "" "${TAG}"`
  // command does not allow to overwrite existing assets, so use 'gh' instead.
  // See https://github.com/github/hub/issues/2657
  await run(`gh release upload ${TAG} ${ASSETS.join(' ')} --clobber`);

})().catch((error) => {
  console.error(`Failed to publish to github: ${error.message || error}.`);
  process.exit(1);
});
