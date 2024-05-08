"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertMarkdownToHtml = void 0;
const marked_1 = require("marked");
const convertMarkdownToHtml = (markdown) => __awaiter(void 0, void 0, void 0, function* () {
    const renderer = new marked_1.marked.Renderer();
    const originalCode = renderer.code;
    renderer.code = (code, language, escaped) => {
        if (language === "mermaid") {
            return `<pre class="mermaid">${code}</pre>`;
        }
        return originalCode(code, language, escaped);
    };
    marked_1.marked.use({ renderer });
    return marked_1.marked.parse(markdown);
});
exports.convertMarkdownToHtml = convertMarkdownToHtml;
