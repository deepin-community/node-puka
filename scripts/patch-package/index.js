'use strict';

const fs = require('fs');
const semver = require('semver');

const pkgFilename = 'package.json';
const backupFilename = 'package.json.orig';

if (!fs.existsSync(backupFilename)) {
  fs.renameSync(pkgFilename, backupFilename);
}

let pkg = JSON.parse(fs.readFileSync(backupFilename));

const merge = (doc, patch) => {
  if (
    Array.isArray(patch)
    || typeof patch !== 'object'
    || typeof doc !== 'object'
  ) {
    return patch;
  }
  for (const key in patch) {
    const value = patch[key];
    if (value === null) {
      delete doc[key];
    } else {
      doc[key] = merge(doc[key], value);
    }
  }
  return doc;
};

for (const ver in pkg.enginePatches) {
  if (semver.satisfies(process.version, ver)) {
    pkg = merge(pkg, pkg.enginePatches[ver]);
  }
}

fs.writeFileSync(pkgFilename, JSON.stringify(pkg));
