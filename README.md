# markdown-preview

Markdown realtime preview on browser with your favorite editor.

## Demo

<video 
  style="max-width: 100%; object-fit: contain;"
  src="https://github.com/mryhryki/markdown-preview/assets/12733897/8c7afd39-4d02-4e9a-b84f-863f11630e6b"
  controls></video>

## Usage

### npx

```shell
$ npx @mryhryki/markdown-preview --file README.md --template default --port 34567 --log-level info --no-opener
Root Directory : /current/dir
Default File   : README.md
Extensions     : md, markdown
Template File  : /path/to/template/default.html
Preview URL    : http://localhost:34567
```

### npm / yarn

```shell
$ npm install -g @mryhryki/markdown-preview
# or
$ yarn install -g @mryhryki/markdown-preview

$ markdown-preview --file README.md --template default-dark --port 34567 --log-level info --no-opener
Root Directory : /current/dir
Default File   : README.md
Extensions     : md, markdown
Template File  : /path/to/template/default-dark.html
Preview URL    : http://localhost:34567
```

## Parameter

| short | long        | environment variable       | parameter                                             | required | default   |
|-------|-------------|----------------------------|-------------------------------------------------------|----------|-----------|
| -f    | --file      | MARKDOWN_PREVIEW_FILE      | ***relative*** file path                              | no       | README.md |
| -t    | --template  | MARKDOWN_PREVIEW_TEMPLATE  | defined template name (*1) or template file path (*2) | no       | default   |
| -p    | --port      | MARKDOWN_PREVIEW_PORT      | port number                                           | no       | 34567     |
|       | --log-level | MARKDOWN_PREVIEW_LOG_LEVEL | trace, debug, info<br>warn, error, fatal              | no       | info      |
|       | --no-opener | MARKDOWN_PREVIEW_NO_OPENER | true (only env var)                                   | no       |           |
| -v    | --version   |                            |                                                       | no       |           |
| -h    | --help      |                            |                                                       | no       |           |

### *1: Defined Template Names

- `default`

### *2: How to create a template file

Creating a template file is easy.
At a minimum, all you need to do is load `/markdown-preview-websocket.js` and pass a callback function with the necessary processing to `connectMarkdownPreview`.

Sample code is presented below.

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

# Watch mode
$ npm run dev

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
