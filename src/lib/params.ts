import path from "node:path";
import { rootDir, templateDir } from "./directory";
import { existsFile } from "./file";
import { type LogLevel, getLogLevel } from "./logger";

interface InnerParams {
  filepath: string;
  extensions: string[];
  template: string;
  port: number;
  logLevel: LogLevel;
  noOpener: boolean;
  version: boolean;
  help: boolean;
}

export class Params {
  public _params: InnerParams;

  constructor(env: Record<string, string | undefined>, argv: string[]) {
    const obj = Object.assign(
      this.getDefaultParams(),
      this.parseEnv(env),
      this.parseArgv(argv),
    );
    this._params = {
      filepath: this.checkFilepath(obj.filepath),
      extensions: obj.extensions,
      template: this.checkTemplate(obj.template),
      port: this.checkPort(obj.port),
      logLevel: getLogLevel(obj.logLevel),
      noOpener: obj.noOpener,
      version: obj.version,
      help: obj.help,
    };
  }

  getDefaultParams(): InnerParams {
    return {
      filepath: "README.md",
      extensions: ["md", "markdown"],
      template: "default",
      port: 34567,
      logLevel: "info",
      noOpener: false,
      version: false,
      help: false,
    };
  }

  parseEnv(env: Record<string, string | undefined>): Partial<InnerParams> {
    const params: Partial<InnerParams> = {};
    if (env.MARKDOWN_PREVIEW_FILE) {
      params.filepath = env.MARKDOWN_PREVIEW_FILE;
    }
    if (env.MARKDOWN_PREVIEW_EXTENSIONS) {
      params.extensions = this.checkExtensions(env.MARKDOWN_PREVIEW_EXTENSIONS);
    }
    if (env.MARKDOWN_PREVIEW_TEMPLATE) {
      params.template = env.MARKDOWN_PREVIEW_TEMPLATE;
    }
    if (env.MARKDOWN_PREVIEW_PORT) {
      params.port = Number.parseInt(env.MARKDOWN_PREVIEW_PORT, 10);
    }
    if (env.MARKDOWN_PREVIEW_NO_OPENER) {
      params.noOpener = env.MARKDOWN_PREVIEW_NO_OPENER === "true";
    }
    if (env.MARKDOWN_PREVIEW_LOG_LEVEL) {
      params.logLevel = getLogLevel(env.MARKDOWN_PREVIEW_LOG_LEVEL);
    }
    return params;
  }

  parseArgv(argv: string[]): Partial<InnerParams> {
    const params: Partial<InnerParams> = {};
    for (let i = 0; i < argv.length; i++) {
      switch (argv[i]) {
        case "-f":
        case "--file":
          params.filepath = argv[i + 1];
          i++;
          break;
        case "-e":
        case "--extensions":
          params.extensions = this.checkExtensions(argv[i + 1]);
          i++;
          break;
        case "-t":
        case "--template":
          params.template = argv[i + 1];
          i++;
          break;
        case "-p":
        case "--port":
          params.port = Number.parseInt(argv[i + 1], 10);
          i++;
          break;
        case "-l":
        case "--log-level":
          params.logLevel = getLogLevel(argv[i + 1]);
          i++;
          break;
        case "--no-opener":
          params.noOpener = true;
          break;
        case "-v":
        case "--version":
          params.version = true;
          break;
        case "-h":
        case "--help":
          params.help = true;
          break;
        default:
          throw new Error(`Unknown option: ${argv[i]}`);
      }
    }
    return params;
  }

  checkFilepath(filepath: string) {
    if (path.isAbsolute(filepath)) {
      throw new Error(`Absolute path is prohibited: ${filepath}`);
    }
    if (!existsFile(filepath)) {
      throw new Error(`File not found: ${filepath}`);
    }
    if (path.relative(rootDir, filepath).match(/\.\./) != null) {
      throw new Error(`Illegal file path: ${filepath}`);
    }
    return filepath;
  }

  checkExtensions(extensions: string): string[] {
    const extensionList = extensions.split(",").map((ext) => ext.trim());
    if (extensionList.length === 0) {
      throw new Error(`Extensions is empty: ${extensions}`);
    }
    return extensionList;
  }

  checkTemplate(template: string): string {
    if (existsFile(path.resolve(templateDir, `${template}.html`))) {
      return path.resolve(templateDir, `${template}.html`);
    }
    if (existsFile(path.resolve(rootDir, template))) {
      return path.resolve(rootDir, template);
    }
    throw new Error(`Template file not found: ${template}`);
  }

  checkPort(port: number): number {
    if (!Number.isNaN(port) && 0 < port && port <= 65535) {
      return port;
    }
    throw new Error(`Invalid port: ${port}`);
  }

  get filepath() {
    return this._params.filepath;
  }

  get extensions(): string[] {
    return this._params.extensions;
  }

  get template(): string {
    return this._params.template;
  }

  get port(): number {
    return this._params.port;
  }

  get logLevel(): LogLevel {
    return this._params.logLevel;
  }

  get noOpener(): boolean {
    return this._params.noOpener;
  }

  get version(): boolean {
    return this._params.version;
  }

  get help(): boolean {
    return this._params.help;
  }
}
