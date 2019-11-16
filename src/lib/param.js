'use strict';

const path = require('path');
const pkg = require('../../package.json');
const Logger = require('./logger');
const { currentDir, templateDir } = require('./directory');
const { existsFile } = require('./file');

const usage = `
Usage:
  npx @hyiromori/markdown-preview [options]
  markdown-preview [options]

Options:
  -f,--file     [relative_file_path] Default: README.md
  -t,--template [template_name]      Default: default
  -p,--port     [port_number]        Default: 34567
  -v,--version
  -h,--help
`;

const showUsage = (exitCode = 1) => {
  console.log(usage);
  process.exit(exitCode);
};

const convPort = (strPort) => {
  const port = parseInt(strPort, 10);
  if (!isNaN(port) && 0 < port && port <= 65535) return port;
  Logger.error('Invalid port:', strPort);
  showUsage();
};

let filepath = process.env.MARKDOWN_PREVIEW_FILE || 'README.md';
let template = process.env.MARKDOWN_PREVIEW_TEMPLATE || 'default';
let port = process.env.MARKDOWN_PREVIEW_PORT ? convPort(process.env.MARKDOWN_PREVIEW_PORT) : 34567;
let noOpener = process.env.MARKDOWN_PREVIEW_NO_OPENER === 'true' || false;
let logLevel = process.env.MARKDOWN_PREVIEW_LOG_LEVEL || 'info';

const param = process.argv.slice(2);
for (let i = 0; i < param.length; i++) {
  switch (param[i]) {
    case '-f':
    case '--file':
      if (path.isAbsolute(param[i + 1])) showUsage(2);
      filepath = param[i + 1];
      i++;
      break;
    case '-p':
    case '--port':
      port = convPort(param[i + 1]);
      i++;
      break;
    case '-t':
    case '--template':
      template = param[i + 1];
      i++;
      break;
    case '-l':
    case '--log-level':
      logLevel = param[i + 1];
      i++;
      break;
    case '--no-opener':
      noOpener = true;
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

if (!existsFile(filepath)) {
  removeTargetFile.error('File not found:', filepath);
  process.exit(2);
}

filepath = path.relative(currentDir, filepath);
if (filepath.match(/\.\./) != null) {
  console.error('Illegal file path:', filepath);
  process.exit(3);
}

if (existsFile(path.resolve(templateDir, `${template}.html`))) {
  template = path.resolve(templateDir, `${template}.html`);
} else if (!existsFile(template)) {
  console.error('Template file not found:', template);
  process.exit(4);
} else {
  template = path.resolve(currentDir, template);
}

if (!['trace', 'debug', 'info', 'warn', 'error', 'fatal'].includes(logLevel)) {
  console.error('Invalid log level:', logLevel);
  process.exit(5);
}

module.exports = {
  showUsage,
  filepath,
  logLevel,
  noOpener,
  port,
  template,
};
