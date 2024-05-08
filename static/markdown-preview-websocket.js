export const connectMarkdownPreview = (onMarkdownFileChanged) => {
  const protocol = location.protocol.replace("http", "ws");
  const url = `${protocol}//${location.host}/ws?path=${encodeURIComponent(location.pathname)}`;
  const ws = new WebSocket(url);
  ws.addEventListener("message", ({ data }) => {
    try {
      const payload = JSON.parse(data);
      if (!("markdown" in payload)) return;
      if (typeof payload.markdown !== "string" || payload.markdown.length === 0) return;
      onMarkdownFileChanged(payload);
    } catch (err) {
      console.error(err);
    }
  });
};
