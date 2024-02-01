import { parse as parseSlides } from "@slidev/parser";

function isImage(text: string) {
  const regex = /^<img [^>]+>$/i;
  return regex.test(text.trim());
}

export async function parseContent(content: string) {
  const parsedPages = await parseSlides(content);
  return parsedPages.slides.map((page) => {
    const sections = page.content
      .split(/\r?\n--\r?\n/g)
      .map(compileMarkdown)
      .map((content) => ({
        content,
        type: isImage(content) ? "image" : "text",
      }));
    return {
      ...page,
      sections,
    };
  });
}
