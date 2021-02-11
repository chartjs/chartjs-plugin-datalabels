/* eslint-disable no-process-exit */

const archiver = require('archiver');
const fs = require('fs');
const path = require('path');
const pkg = require('../package.json');

const root = path.resolve(__dirname, '..');
const inputs = [
  path.join(root, 'dist', `${pkg.name}.js`),
  path.join(root, 'dist', `${pkg.name}.min.js`),
  path.join(root, 'dist', `${pkg.name}.esm.js`),
  path.join(root, 'LICENSE.md'),
  path.join(root, 'README.md'),
];

const targets = [
  {format: 'tar', ext: 'tgz', options: {gzip: true}},
  {format: 'zip', ext: 'zip', options: {}},
];

(async() => {
  for (const input of inputs) {
    if (!fs.existsSync(input)) {
      throw new Error(
        `The file "${path.relative(root, input)}" does not ` +
        'exists: make sure to execute "npm run build" first');
    }
  }

  await Promise.all(targets.map((target) => {
    const dest = path.join(root, 'dist', `${pkg.name}.${target.ext}`);
    const archive = archiver(target.format, target.options);
    for (const input of inputs) {
      archive.file(input, {name: path.basename(input)});
    }

    archive.pipe(fs.createWriteStream(dest));
    return archive.finalize();
  }));
})().catch((error) => {
  console.error(`Failed to create packages: ${error.message || error}.`);
  process.exit(1);
});
