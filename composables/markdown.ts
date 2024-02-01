import { marked } from "marked";
import pkg from "isomorphic-dompurify";
const { sanitize } = pkg;
import markedKatex from "marked-katex-extension";

function preSanitize(content: string) {
  const regex = /\s:([a-zA-Z-_\.:]+)="/gm;
  const subst = ` data-v-bind:$1="`;
  const regex2 = /\s@([a-zA-Z-_\.:]+)="/gm;
  const subst2 = ` data-v-on:$1="`;
  const regex3 = /\sv-([a-zA-Z-_\.:]+)/gm;
  const subst3 = ` data-v-$1`;
  return content
    .replace(regex, subst)
    .replace(regex2, subst2)
    .replace(regex3, subst3);
}

const postSanitize = (content: string) => {
  return content.replace(/data-v-/g, "v-");
};

export function convertImageUrlsToMarkdown(text: string) {
  // Regular expression to match image URLs (supports common image file extensions).
  const imageUrlRegex =
    /(https?:\/\/[^\s]+(\.png|\.jpg|\.jpeg|\.gif|\.bmp|\.svg))/gi;

  // Replace image URLs with Markdown image links.
  const markdownText = text.replace(imageUrlRegex, "![]($1)");

  return markdownText;
}

const renderer = {
  link(href: string, title: string | null | undefined, text: string): string {
    const cleanHref = cleanUrl(href);
    if (cleanHref === null) {
      return text;
    }
    href = cleanHref;
    let out = '<a href="' + href + '"';
    if (title) {
      out += ' title="' + title + '"';
    }
    if (href.startsWith("http")) {
      out += ' target="_blank"';
    }
    out += ">" + text + "</a>";
    return out;
  },
  paragraph(text: string) {
    if (text.startsWith("<img")) {
      return text;
    }
    return `<p>${text}</p>`;
  },
};

marked.use({ renderer });
marked.use(markedKatex({ output: "html", throwOnError: false }));

export function cleanUrl(href: string) {
  try {
    href = encodeURI(href).replace(/%25/g, "%");
  } catch (e) {
    return null;
  }
  return href;
}

export function compileMarkdown(source: string) {
  return postSanitize(
    sanitize(
      preSanitize(
        marked(convertImageUrlsToMarkdown(source), {
          breaks: true,
          gfm: true,
        })
      ),
      { ADD_ATTR: ["target"] }
    )
  );
}
