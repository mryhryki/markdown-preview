const path = require('path');
const { rootDir } = require('./directory');
const Params = require('./params');

const DEFAULT_VALUES = {
  filepath: 'README.md',
  template: path.resolve(rootDir, 'template/default.html'),
  port: 34567,
  logLevel: 'info',
  noOpener: false,
  version: false,
  help: false,
};

describe('Params', () => {
  it('not specify', () => {
    const params = new Params({}, []);
    expect(params.params).toEqual(DEFAULT_VALUES);
  });

  it('specify all short argument', () => {
    const argv = [
      '-f', 'test/markdown/markdown1.md',
      '-t', 'test/template/template1.html',
      '-p', '100',
      '-v',
      '-h',
    ];
    const expectParams = {
      filepath: 'test/markdown/markdown1.md',
      template: path.resolve(rootDir, 'test/template/template1.html'),
      port: 100,
      logLevel: 'info',
      noOpener: false,
      version: true,
      help: true,
    };
    const params = new Params({}, argv);
    expect(params.params).toEqual(expectParams);
  });

  it('specify all long argument', () => {
    const argv = [
      '--file', 'test/markdown/markdown1.md',
      '--template', 'test/template/template1.html',
      '--port', '100',
      '--log-level', 'trace',
      '--no-opener',
      '--version',
      '--help',
    ];
    const expectParams = {
      filepath: 'test/markdown/markdown1.md',
      template: path.resolve(rootDir, 'test/template/template1.html'),
      port: 100,
      logLevel: 'trace',
      noOpener: true,
      version: true,
      help: true,
    };
    const params = new Params({}, argv);
    expect(params.params).toEqual(expectParams);
  });

  it('specify all environment variable', () => {
    const env = {
      MARKDOWN_PREVIEW_FILE: 'test/markdown/markdown1.md',
      MARKDOWN_PREVIEW_TEMPLATE: 'test/template/template1.html',
      MARKDOWN_PREVIEW_PORT: '100',
      MARKDOWN_PREVIEW_LOG_LEVEL: 'trace',
      MARKDOWN_PREVIEW_NO_OPENER: 'true',
    };
    const expectParams = {
      filepath: 'test/markdown/markdown1.md',
      template: path.resolve(rootDir, 'test/template/template1.html'),
      port: 100,
      logLevel: 'trace',
      noOpener: true,
      version: false,
      help: false,
    };
    const params = new Params(env, []);
    expect(params.params).toEqual(expectParams);
  });
});
