import { load } from "cheerio";

function extractText(element) {
  return element.text().replace(/\s+/g, " ").trim();
}

async function processContent(content) {
  const $ = load(content);
  // Extract data using Cheerio
  const title = $("title").text();
  const description = $('meta[name="description"]').attr("content");
  const image =
    $('meta[property="og:image"]').attr("content") || $("img").attr("src");

  // Extract headings
  const headings = [];
  $("h1, h2, h3, h4, h5, h6").each(function () {
    const text = extractText($(this));
    headings.push({ tag: this.tagName.toLowerCase(), text });
  });

  // Extract paragraphs
  const paragraphs = [];
  $("p").each(function () {
    const text = extractText($(this));
    paragraphs.push({ tag: "p", text });
  });

  // Extract tables
  const tables = [];
  $("table").each(function () {
    const table = [];
    $(this)
      .find("tr")
      .each(function () {
        const row = [];
        $(this)
          .find("td, th")
          .each(function () {
            const text = extractText($(this));
            row.push({ tag: this.tagName.toLowerCase(), text });
          });
        table.push(row);
      });
    tables.push({ tag: "table", data: table });
  });

  // Extract all relevant metadata
  const metadata: Metadata = {
    title,
    description,
    image,
    content: {
      headings,
      paragraphs,
      tables,
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
    headings: { tag: string; text: string }[];
    paragraphs: { tag: string; text: string }[];
    tables: { tag: string; data: string[][] }[];
  };
  rawHtml: string;
};

export async function getSummaryFromText(text: string) {
  return await processContent(text);
}

export function extractCleanMetaTags(html) {
  const metaTagPattern = /<meta[^>]*>/g;
  const metaTags = html.match(metaTagPattern);

  if (metaTags) {
    debugger;
    console.log(metaTags);
    return metaTags.map((tag) => tag.replace(/\//g, "")).join("\n");
  }

  return "No meta tags found";
}
