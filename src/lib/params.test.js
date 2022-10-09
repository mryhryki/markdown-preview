const path = require("path");
const { projectDir } = require("./directory");
const Params = require("./params");

const DEFAULT_VALUES = {
  filepath: "README.md",
  extensions: ["md", "markdown"],
  template: path.resolve(projectDir, "template/default.html"),
  port: 34567,
  logLevel: "info",
  noOpener: false,
  version: false,
  help: false,
};

describe("Params", () => {
  it("not specify", () => {
    const params = new Params({}, []);
    expect(params._params).toEqual(DEFAULT_VALUES);
  });

  it("specify all short argument", () => {
    const argv = [
      "-f",
      "test/markdown/markdown1.md",
      "-e",
      "ext1,ext2",
      "-t",
      "test/template/template1.html",
      "-p",
      "100",
      "-v",
      "-h",
    ];
    const expectParams = {
      filepath: "test/markdown/markdown1.md",
      extensions: ["ext1", "ext2"],
      template: path.resolve(projectDir, "test/template/template1.html"),
      port: 100,
      logLevel: "info",
      noOpener: false,
      version: true,
      help: true,
    };
    const params = new Params({}, argv);
    expect(params._params).toEqual(expectParams);
  });

  it("specify all long argument", () => {
    const argv = [
      "--file",
      "test/markdown/markdown1.md",
      "--extensions",
      "ext1,ext2",
      "--template",
      "test/template/template1.html",
      "--port",
      "100",
      "--log-level",
      "trace",
      "--no-opener",
      "--version",
      "--help",
    ];
    const expectParams = {
      filepath: "test/markdown/markdown1.md",
      extensions: ["ext1", "ext2"],
      template: path.resolve(projectDir, "test/template/template1.html"),
      port: 100,
      logLevel: "trace",
      noOpener: true,
      version: true,
      help: true,
    };
    const params = new Params({}, argv);
    expect(params._params).toEqual(expectParams);
  });

  it("specify all environment variable", () => {
    const env = {
      MARKDOWN_PREVIEW_FILE: "test/markdown/markdown1.md",
      MARKDOWN_PREVIEW_EXTENSIONS: "ext1, ext2",
      MARKDOWN_PREVIEW_TEMPLATE: "test/template/template1.html",
      MARKDOWN_PREVIEW_PORT: "100",
      MARKDOWN_PREVIEW_LOG_LEVEL: "trace",
      MARKDOWN_PREVIEW_NO_OPENER: "true",
    };
    const expectParams = {
      filepath: "test/markdown/markdown1.md",
      extensions: ["ext1", "ext2"],
      template: path.resolve(projectDir, "test/template/template1.html"),
      port: 100,
      logLevel: "trace",
      noOpener: true,
      version: false,
      help: false,
    };
    const params = new Params(env, []);
    expect(params._params).toEqual(expectParams);
  });
});
