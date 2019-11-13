'use strict';

const HTML = `
<!doctype html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
  <title>Markdown Preview</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/3.0.1/github-markdown.css">
  <link rel="stylesheet" href="//cdn.jsdelivr.net/gh/highlightjs/cdn-release@9.16.2/build/styles/default.min.css">
  <script src="//cdn.jsdelivr.net/gh/highlightjs/cdn-release@9.16.2/build/highlight.min.js"></script>
</head>
<body style="margin: 0 auto; max-width: 882px; padding: 32px;">
  <div class="markdown-body"><div id="content"></div></div>
  <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
  <script type="text/javascript">
    const highlight = () => {
      document.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightBlock(block);
      });
    }
    window.onload = () => {
      const ws = new WebSocket(location.protocol.replace('http', 'ws') + '//' + location.host + '/ws');
      ws.addEventListener('message', ({ data }) => {
        if (typeof(data) !== 'string' || data.length === 0) return;
        document.getElementById('content').innerHTML = marked(data);
        highlight();
      });
    }
  </script>
</body>
</html>
`;

module.exports.MarkdownHandler = (_req, res) => {
  res.send(HTML);
};
