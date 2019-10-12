'use strict';

const fs = require('fs');
const path = require('path');

const usage = `
Usage:
  npx @hyiromori/markdown-preview [options] <filepath>

Options:
  -p,--port [port_number]   Default: 34567
`;

const showUsage = (exitCode = 1) => {
  console.log(usage);
  process.exit(exitCode);
};

let filepath = null;
let port = 34567;

const args = process.argv.slice(2);
for (let i = 0; i < args.length; i++) {
  switch (args[i]) {
    case '-p':
    case '--port':
      const p = parseInt(args[i + 1], 10);
      if (isNaN(p) || p < 0 || 65535 < p) {
        console.error('Invalid port:', args[i + 1]);
        showUsage();
      }
      port = p;
      i++;
      break;
    default:
      filepath = args[i];
  }
}

if (filepath == null) {
  showUsage();
}
filepath = path.isAbsolute(filepath) ? filepath : path.resolve(process.cwd(), filepath);
try {
  fs.statSync(filepath);
} catch (_) {
  console.error('File not found:', filepath);
  process.exit(2);
}

module.exports = {
  showUsage,
  filepath,
  port,
};
