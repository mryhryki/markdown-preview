import { Marked } from "marked";
import { markedHighlight } from "marked-highlight";
import hljs from "highlight.js";

export const convertMarkdownToHtml = async (markdown: string): Promise<string> => {
  // https://github.com/markedjs/marked-highlight?tab=readme-ov-file#usage
  const marked = new Marked(
    markedHighlight({
      langPrefix: "hljs language-",
      highlight(code, lang /* , info */) {
        const language = hljs.getLanguage(lang) ? lang : "plaintext";
        return hljs.highlight(code, { language }).value;
      },
    }),
  );
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
