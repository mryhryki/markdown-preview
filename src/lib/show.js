'use strict';

const showUsage = (error = false) => {
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
  console.log(usage);
  process.exit(error ? 1 : 0);
};

const showVersion = () => {
  console.log(pkg.version);
  process.exit(0);
};

module.exports = {
  showUsage,
  showVersion,
};
