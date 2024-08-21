import emojiLib from "emojilib";
import hljs from "highlight.js";
import { Marked, type Tokens } from "marked";
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
  const EmojiWarnings: string[] = [];
  const Emojis: Record<string, string> = Object.entries(emojiLib).reduce(
    (dict, [emoji, keywords]) => {
      for (const keyword of keywords) {
        if (dict[keyword] == null) {
          dict[keyword] = emoji;
        } else {
          EmojiWarnings.push(
            `[DUPLICATED] Keyword "${keyword}" is converted ${dict[keyword]}, not ${emoji}`,
          );
        }
      }
      return dict;
    },
    {} as Record<string, string>,
  );

  console.info(
    "[Emoji list]\n",
    Object.entries(Emojis)
      .map(([keyword, emoji]) => `${keyword}: ${emoji}`)
      .sort()
      .join("\n"),
  );
  if (EmojiWarnings.length > 0) {
    console.warn("[Emoji warnings]", EmojiWarnings.sort().join("\n"));
  }

  const options = {
    emojis: Emojis,
    renderer: (token: EmojiToken) => token.emoji,
  };
  marked.use(markedEmoji(options));

  marked.use({
    renderer: {
      code: (token: Tokens.Code) => {
        const { lang, raw } = token;
        if (lang === "mermaid") {
          return `<pre class="mermaid">${raw}</pre>`;
        }
        return false;
      },
    },
  });
  element.innerHTML = await marked.parse(markdown);

  // document.querySelectorAll("pre code").forEach((block) => {
  //   hljs.highlightElement(block);
  // });
  await mermaid.run();
};
