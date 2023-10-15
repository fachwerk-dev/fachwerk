import MarkdownIt from "markdown-it";
import MarkdownItExternalLinks from "markdown-it-external-links";

export function convertImageUrlsToMarkdown(text: string) {
  // Regular expression to match image URLs (supports common image file extensions).
  const imageUrlRegex =
    /(https?:\/\/[^\s]+(\.png|\.jpg|\.jpeg|\.gif|\.bmp|\.svg))/gi;

  // Replace image URLs with Markdown image links.
  const markdownText = text.replace(imageUrlRegex, "![]($1)");

  return markdownText;
}

export function compileMarkdown(source: string) {
  const md = new MarkdownIt({ linkify: true, html: true, breaks: true }).use(
    MarkdownItExternalLinks,
    {
      externalClassName: null,
      externalTarget: "_blank",
    }
  );
  return md.render(convertImageUrlsToMarkdown(source));
}
