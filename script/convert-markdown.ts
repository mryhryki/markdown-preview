import emojiLib from "emojilib";
import hljs from "highlight.js";
import { Marked } from "marked";
import { type EmojiToken, markedEmoji } from "marked-emoji";
import { markedHighlight } from "marked-highlight";
import mermaid from "mermaid";

export const convertMarkdownToHtml = async (
  element: HTMLElement,
  markdown: string,
): Promise<void> => {
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

  // Emoji
  const options = {
    emojis: Object.entries(emojiLib).reduce(
      (dict, [emoji, keywords]) => {
        for (const keyword of keywords) {
          if (dict[keyword] == null) {
            dict[keyword] = emoji;
          } else {
            console.warn(
              `Duplicate emoji (${dict[keyword]}) for keyword: ${keyword} ${emoji}`,
            );
          }
        }
        return dict;
      },
      {} as Record<string, string>,
    ),
    renderer: (token: EmojiToken) => token.emoji,
  };
  marked.use(markedEmoji(options));

  const renderer = new marked.Renderer();
  const originalCode = renderer.code;
  renderer.code = (code, language, escaped) => {
    if (language === "mermaid") {
      return `<pre class="mermaid">${code}</pre>`;
    }
    return originalCode(code, language, escaped);
  };
  marked.use({ renderer });
  element.innerHTML = await marked.parse(markdown);

  // document.querySelectorAll("pre code").forEach((block) => {
  //   hljs.highlightElement(block);
  // });
  await mermaid.run();
};
