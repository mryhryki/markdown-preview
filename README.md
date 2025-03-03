# markdown-preview

Markdown realtime preview on browser with your favorite editor.

## Concept

- Execute immediately with [npx](#npx).
- Offline support if [installed](#npm--yarn-install).
- [You can create your own template easily.](#2-how-to-create-a-template-file)

## Demo

<video 
  style="max-width: 100%; object-fit: contain;"
  src="https://github.com/mryhryki/markdown-preview/assets/12733897/8c7afd39-4d02-4e9a-b84f-863f11630e6b"
  controls></video>

## Usage

### npx

```shell
$ npx @mryhryki/markdown-preview
Version        : v0.6.0
Root Directory : /current/dir
Default File   : README.md
Extensions     : md, markdown
Template File  : /path/to/template/default.html
Preview URL    : http://localhost:34567
```

### npm / yarn (install)

```shell
$ npm install -g @mryhryki/markdown-preview
# or
$ yarn install -g @mryhryki/markdown-preview

$ markdown-preview
Version        : v0.6.0
Root Directory : /current/dir
Default File   : README.md
Extensions     : md, markdown
Template File  : /path/to/template/default-dark.html
Preview URL    : http://localhost:34567
```

## Parameter

| short | long         | environment variable        | parameter                                             | required | default     |
|-------|--------------|-----------------------------|-------------------------------------------------------|----------|-------------|
| -f    | --file       | MARKDOWN_PREVIEW_FILE       | ***relative*** file path                              | no       | README.md   |
| -e    | --extensions | MARKDOWN_PREVIEW_EXTENSIONS | comma separated extensions                            | no       | md,markdown |
| -t    | --template   | MARKDOWN_PREVIEW_TEMPLATE   | defined template name (*1) or template file path (*2) | no       | default     |
| -p    | --port       | MARKDOWN_PREVIEW_PORT       | port number                                           | no       | 34567       |
|       | --log-level  | MARKDOWN_PREVIEW_LOG_LEVEL  | trace, debug, info<br>warn, error, fatal              | no       | info        |
|       | --no-opener  | MARKDOWN_PREVIEW_NO_OPENER  | true (only env var)                                   | no       |             |
| -v    | --version    |                             |                                                       | no       |             |
| -h    | --help       |                             |                                                       | no       |             |

### *1: Defined Template Names

- `default`

### *2: How to create a template file

You just need to load `/markdown-preview-websocket.js` and register a callback to `connectMarkdownPreview`.

A simple example code is below:

```html
<!doctype html>
<html>
  <head>
    <title>Minimum Template Sample</title>
  </head>
  <body>
    <pre id="raw-markdown"></pre>
    <script type="module">
      import { connectMarkdownPreview } from "/markdown-preview-websocket.js";
      connectMarkdownPreview(({ markdown }) => {
        document.getElementById('raw-markdown').innerHTML =
          markdown.replace(/</g, '&lt;').replace(/>/g, '&gt;');
      });
    </script>
  </body>
</html>
```

## Development

```shell
$ npm install

# Build and Run
$ npm start

# Test
$ npm test
$ npm run test:watch

# Type check
$ npm run type
$ npm run type:watch

# Check code format
$ npm run lint

# Formatter
$ npm run fmt
```

## Release

Run [release](https://github.com/mryhryki/markdown-preview/actions/workflows/release.yaml) workflow.
