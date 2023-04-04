import { load } from "cheerio";
import { unified } from "unified";
import rehypeParse from "rehype-parse";
import rehypeRemark from "rehype-remark";
import remarkStringify from "remark-stringify";
import remarkGfm from "remark-gfm";
import { HTMLMetadata } from "./types";

const URL_REGEX = new RegExp(
  "^(https?:\\/\\/)?" +
    "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" +
    "((\\d{1,3}\\.){3}\\d{1,3}))" +
    "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" +
    "(\\?[;&a-z\\d%_.~+=-]*)?" +
    "(\\#[-a-z\\d_]*)?$",
  "i"
);

async function processHtml(rawHtml: string) {
  const $ = load(rawHtml);

  const title = $("title").text();
  const description = $('meta[name="description"]').attr("content");
  const image = $('meta[property="og:image"]').attr("content");

  const markdown = await unified()
    .use(rehypeParse, { fragment: true })
    .use(rehypeRemark)
    .use(remarkGfm)
    .use(remarkStringify)
    .process(rawHtml);

  const markdownContent = String(markdown);

  return {
    title,
    description,
    image,
    content: {
      markdown: markdownContent.slice(0, 3800),
    },
    rawHtml,
  };
}

export async function getMarkdownFromHtml(
  rawHtml: string
): Promise<HTMLMetadata> {
  return await processHtml(rawHtml);
}

export const parseUrlOrDie = (url: string): string => {
  url = url.slice(1).replace("https:/", "https://");
  if (!url.startsWith("https://")) url = "https://" + url;
  if (!URL_REGEX.test(url)) throw new Error("Invalid URL");
  return url;
};
