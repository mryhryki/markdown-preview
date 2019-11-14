'use strict';

const fs = require('fs');
const path = require('path');
const pkg = require('../../package.json');

const usage = `
Usage:
  npx @hyiromori/markdown-preview [options]
  markdown-preview [options]

Options:
  -p,--port [port_number]        Default: 34567
  -f,--file [relative_file_path] Default: README.md
  -v,--version
  -h,--help
`;

const showUsage = (exitCode = 1) => {
  console.log(usage);
  process.exit(exitCode);
};

let filepath = 'README.md';
let port = 34567;

const args = process.argv.slice(2);
for (let i = 0; i < args.length; i++) {
  switch (args[i]) {
    case '-f':
    case '--file':
      if (path.isAbsolute(args[i + 1])) showUsage(2);
      filepath = args[i + 1];
      i++;
      break;
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
    case '-v':
    case '--version':
      console.log(pkg.version);
      process.exit(0);
      break;
    case '-h':
    case '--help':
      showUsage(0);
      break;
    default:
      showUsage(1);
  }
}

try {
  fs.statSync(filepath);
} catch (_) {
  console.error('File not found:', filepath);
  process.exit(2);
}

filepath = `${path.relative(process.cwd(), filepath)}`;
if (filepath.match(/\.\./) != null) {
  console.error('Illegal file path:', filepath);
  process.exit(3);
}

module.exports = {
  showUsage,
  filepath,
  port,
};