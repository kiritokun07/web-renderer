import { format } from "prettier/standalone";
import html from "prettier/plugins/html";
import postcss from "prettier/plugins/postcss";
import babel from "prettier/plugins/babel";
import estree from "prettier/plugins/estree";

export function formatCode(source, language) {
  return format(source, { parser: { html: "html", css: "css", js: "babel" }[language], plugins: [html, postcss, babel, estree], tabWidth: 2, printWidth: 90 });
}
