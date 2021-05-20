/* eslint-disable no-process-exit */

const {run} = require('./utils');
const pkg = require('../package.json');

const TAG = `v${pkg.version}`;
const TAG_FILES = [
  `dist/${pkg.name}.js`,
  `dist/${pkg.name}.min.js`,
  `dist/${pkg.name}.esm.js`,
  'bower.json',
];

(async() => {
  if (!process.env.GH_AUTH_EMAIL) {
    throw new Error('GH_AUTH_EMAIL environment variable required');
  }
  if (!process.env.GH_AUTH_NAME) {
    throw new Error('GH_AUTH_NAME environment variable required');
  }
  if (await run(`git ls-remote origin refs/tags/${TAG}`)) {
    throw new Error(`Git tag ${TAG} already exists`);
  }

  // Tag a detached branch containing the dist (and bower) files.
  await run(`git config --global user.email "${process.env.GH_AUTH_EMAIL}"`);
  await run(`git config --global user.name "${process.env.GH_AUTH_NAME}"`);
  await run('git checkout --detach --quiet');
  await run(`git add -f ${TAG_FILES.join(' ')}`);
  await run(`git commit -m "Release ${TAG}"`);
  await run(`git tag -a "${TAG}" -m "Version ${pkg.version}"`);
  await run(`git push origin refs/tags/${TAG}`);

})().catch((error) => {
  console.error(`Failed to create release tag: ${error.message || error}.`);
  process.exit(1);
});
