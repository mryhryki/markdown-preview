const connectMarkdownPreview = (onMarkdownFileChanged) => {
  const ws = new WebSocket(location.protocol.replace('http', 'ws') + '//' + location.host + '/ws');
  ws.addEventListener('message', ({ data }) => {
    try {
      const payload = JSON.parse(data);
      if (!('markdown' in payload)) return;
      if (typeof (payload.markdown) !== 'string' || payload.markdown.length === 0) return;
      onMarkdownFileChanged(payload);
    } catch (err) {
      console.error(err);
    }
  });
};
