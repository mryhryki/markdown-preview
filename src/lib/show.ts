"use strict";

import * as pkg from "../../package.json";

export function showUsage(error = false): void {
  const usage = `
Usage:
  npx @mryhryki/markdown-preview [options]
  markdown-preview [options]

Options:
  -f,--file     [relative_file_path] Default: README.md
  -t,--template [template_name]      Default: default
  -p,--port     [port_number]        Default: 34567
  -v,--version
  -h,--help
`;
  console.log(usage);
  process.exit(error ? 1 : 0);
}

export function showVersion(): void {
  console.log(pkg.version);
  process.exit(0);
}
