'use strict';

const spawn = require('child_process').spawn;
const appVeyor = require('tap-appveyor');
const merge = require('tap-merge');

const toAppVeyor = merge().pipe(appVeyor());

const runTests = (scriptName, cb) => {
  const cmd = ['npm run ', scriptName, ' --tap'].join('');
  const child = spawn(cmd, { shell: true, stdio: ['pipe', 'pipe', 'inherit'] });
  child.stdout.pipe(toAppVeyor);
  child.stdout.pipe(process.stdout);
  child.on('close', code => {
    if (code) {
      process.exitCode = code + (process.exitCode || 0);
    }
    if (cb) {
      cb();
    }
  });
};

if (process.env.include_spawn) {
  runTests('test:spawn', () => runTests('test:coverage'));
} else {
  runTests('test:coverage');
}
