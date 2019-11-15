# markdown-preview

Markdown realtime preview on browser with your favorite editor.

## Demo

![DEMO](https://github.com/hyiromori/markdown-preview/raw/master/gif/demo.gif)

## Usage

### npx

```
$ npx @hyiromori/markdown-preview --port 34567 --file README.md

Root Directory : /current/dir
Default File   : README.md
Preview URL    : http://localhost:34567/
```

### npm / yarn

```
$ npm install -g @hyiromori/markdown-preview
# or
$ yarn install -g @hyiromori/markdown-preview

$ markdown-preview --port 34567 --file README.md

Root Directory : /current/dir
Default File   : README.md
Preview URL    : http://localhost:34567/
```

## Arguments

| short | long       | parameter            | required | description          |
|-------|------------|----------------------|----------|----------------------|
| -f    | --file     | `relative` file path | no       | default: `README.md` |
| -t    | --template | template name(*1)    | no       | default: `default`   |
| -p    | --port     | port number          | no       | default: `34567`     |
| -v    | --version  |                      | no       |                      |
| -h    | --help     |                      | no       |                      |

*1: defined template name or html file path.

### Defined Template Names

* `default`

## Minimum Customized Template

```html
<!doctype html>
<html>
  <head>
    <title>Minimum Customized Template</title>
  </head>
  <body>
    <pre id="raw-markdown"></pre>
    <script src="/markdown-preview-websocket.js"></script>
    <script type="text/javascript">
      connectMarkdownPreview((changedEvent) => {
        const { markdown } = changedEvent;
        document.getElementById('raw-markdown').innerHTML = markdown.replace(/</g, '&lt;').replace(/</g, '&gt;');
      });
    </script>
  </body>
</html>
```
