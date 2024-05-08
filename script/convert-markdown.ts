import { marked } from "marked";

export const convertMarkdownToHtml = async (markdown: string): Promise<string> => {
  const renderer = new marked.Renderer();
  const originalCode = renderer.code;
  renderer.code = (code, language, escaped) => {
    if (language === "mermaid") {
      return `<pre class="mermaid">${code}</pre>`;
    }
    return originalCode(code, language, escaped);
  };
  marked.use({ renderer });
  return marked.parse(markdown);
};
