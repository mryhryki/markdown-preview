import { marked } from "marked";

export const convertMarkdownToHtml = async (markdown: string): Promise<string> => {
  return marked.parse(markdown);
};
