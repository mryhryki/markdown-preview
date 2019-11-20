'use strict';

const path = require('path');
const { currentDir, templateDir } = require('./directory');
const { existsFile } = require('./file');

class Params {
  constructor(env, argv) {
    const obj = Object.assign({}, this.getDefaultParams(), this.parseEnv(env), this.parseArgv(argv));
    this._params = {
      filepath: this.checkFilepath(obj.filepath),
      template: this.checkTemplate(obj.template),
      port: this.checkPort(obj.port),
      logLevel: this.checkLogLevel(obj.logLevel),
      noOpener: obj.noOpener,
      version: obj.version,
      help: obj.help,
    };
  }

  getDefaultParams() {
    return {
      filepath: 'README.md',
      template: 'default',
      port: 34567,
      logLevel: 'info',
      noOpener: false,
      version: false,
      help: false,
    };
  }

  parseEnv(env) {
    const params = {};
    if (env.MARKDOWN_PREVIEW_FILE) {
      params.filepath = env.MARKDOWN_PREVIEW_FILE;
    }
    if (env.MARKDOWN_PREVIEW_TEMPLATE) {
      params.template = env.MARKDOWN_PREVIEW_TEMPLATE;
    }
    if (env.MARKDOWN_PREVIEW_PORT) {
      params.port = env.MARKDOWN_PREVIEW_PORT;
    }
    if (env.MARKDOWN_PREVIEW_NO_OPENER) {
      params.noOpener = env.MARKDOWN_PREVIEW_NO_OPENER === 'true';
    }
    if (env.MARKDOWN_PREVIEW_LOG_LEVEL) {
      params.logLevel = env.MARKDOWN_PREVIEW_LOG_LEVEL;
    }
    return params;
  }

  parseArgv(argv) {
    const params = {};
    for (let i = 0; i < argv.length; i++) {
      switch (argv[i]) {
        case '-f':
        case '--file':
          params.filepath = argv[i + 1];
          i++;
          break;
        case '-t':
        case '--template':
          params.template = argv[i + 1];
          i++;
          break;
        case '-p':
        case '--port':
          params.port = argv[i + 1];
          i++;
          break;
        case '-l':
        case '--log-level':
          params.logLevel = argv[i + 1];
          i++;
          break;
        case '--no-opener':
          params.noOpener = true;
          break;
        case '-v':
        case '--version':
          params.version = true;
          break;
        case '-h':
        case '--help':
          params.help = true;
          break;
        default:
          throw new Error(`Unknown option: ${argv[i]}`);
      }
    }
    return params;
  }


  checkFilepath(filepath) {
    if (path.isAbsolute(filepath)) {
      throw new Error(`Absolute path is prohibited: ${filepath}`);
    }
    if (!existsFile(filepath)) {
      throw new Error(`File not found: ${filepath}`);
    }
    if (path.relative(currentDir, filepath).match(/\.\./) != null) {
      throw new Error(`Illegal file path: ${filepath}`);
    }
    return filepath;
  }

  checkTemplate(template) {
    if (existsFile(path.resolve(templateDir, `${template}.html`))) {
      return path.resolve(templateDir, `${template}.html`);
    } else if (existsFile(path.resolve(currentDir, template))) {
      return path.resolve(currentDir, template);
    }
    throw new Error(`Template file not found: ${template}`);
  }

  checkPort(port) {
    const intPort = parseInt(port, 10);
    if (!isNaN(intPort) && 0 < intPort && intPort <= 65535) {
      return intPort;
    }
    throw new Error(`Invalid port: ${port}`);
  };


  checkLogLevel(logLevel) {
    if (['trace', 'debug', 'info', 'warn', 'error', 'fatal'].includes(logLevel)) {
      return logLevel;
    }
    throw new Error(`Invalid log level: ${logLevel}`);
  }

  get filepath() {
    return this._params.filepath;
  }

  get template() {
    return this._params.template;
  }

  get port() {
    return this._params.port;
  }

  get logLevel() {
    return this._params.logLevel;
  }

  get noOpener() {
    return this._params.noOpener;
  }

  get version() {
    return this._params.version;
  }

  get help() {
    return this._params.help;
  }
}

module.exports = Params;
