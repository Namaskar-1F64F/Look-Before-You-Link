import { load } from "cheerio";
import { unified } from "unified";
import rehypeParse from "rehype-parse";
import rehypeRemark from "rehype-remark";
import remarkStringify from "remark-stringify";
import redis from "./redis";

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

export async function getSummaryFromText(url, text): Promise<Metadata> {
  return new Promise(async (resolve, reject) => {
    // Check if the summary is in cache
    redis.get(`summary-${url}`, async (err, cachedSummary) => {
      if (err) {
        reject(err);
      }

      if (cachedSummary) {
        resolve(JSON.parse(cachedSummary));
      } else {
        try {
          const summary = await processContent(text);

          const result = summary;

          redis.setex(`summary-${url}`, 60 * 60 * 3, JSON.stringify(result));

          resolve(result);
        } catch (error) {
          console.error(`Error generating summary from ${url}:`, error);
          resolve(null);
        }
      }
    });
  });
}
