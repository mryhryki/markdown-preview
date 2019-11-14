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

| short | long      | parameter            | required | description          |
|-------|-----------|----------------------|----------|----------------------|
| -f    | --file    | `relative` file path | no       | default: `README.md` |
| -p    | --port    | port number          | no       | default: `34567`     |
| -v    | --version |                      | no       |                      |
| -h    | --help    |                      | no       |                      |
