import { load } from "cheerio";
import { unified } from "unified";
import rehypeParse from "rehype-parse";
import rehypeRemark from "rehype-remark";
import remarkStringify from "remark-stringify";

async function processContent(content) {
  const $ = load(content);

  // Extract data using Cheerio
  const title = $("title").text();
  const description = $('meta[name="description"]').attr("content");
  const image =
    $('meta[property="og:image"]').attr("content") || $("img").attr("src");

  // Process HTML content and convert it to Markdown
  const markdown = await unified()
    .use(rehypeParse, { fragment: true })
    .use(rehypeRemark)
    .use(remarkStringify)
    .process(content);

  const markdownContent = String(markdown);
  // send only 3800 characters to openai
  const openaiContent = markdownContent.slice(0, 3800);
  const metadata: Metadata = {
    title,
    description,
    image,
    content: {
      markdown: openaiContent,
    },
    rawHtml: content,
  };

  return metadata;
}

export type Metadata = {
  title: string;
  description: string;
  image: string;
  content: {
    markdown: string;
  };
  rawHtml: string;
};

export async function getSummaryFromText(text: string) {
  return await processContent(text);
}

export function extractCleanMetaTags(html) {
  const metaTagPattern = /<meta[^>]*>/g;
  let metaTags = html.match(metaTagPattern);
  metaTags = metaTags.filter(
    (tag) =>
      !tag.includes("charSet") &&
      !tag.includes("viewport") &&
      !tag.includes("next-head-count")
  );
  if (metaTags) {
    return metaTags.map((tag) => tag.replace(/\//g, "")).join("\n");
  }

  return "No meta tags found";
}
