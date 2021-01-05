const fs = require('fs');
const path = require('path');
const pkg = require('../package.json');

const output = path.resolve(__dirname, '../bower.json');
const json = JSON.stringify({
  name: pkg.name,
  description: pkg.description,
  homepage: pkg.homepage,
  license: pkg.license,
  version: pkg.version,
  main: pkg.main,
}, null, 2);

fs.writeFileSync(output, json + '\n');
