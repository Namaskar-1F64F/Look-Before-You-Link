import edgeChromium from "chrome-aws-lambda";

import puppeteer from "puppeteer-core";
import { load } from "cheerio";
const LOCAL_CHROME_EXECUTABLE =
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

export async function fetchWebsiteContent(url) {
  const executablePath =
    (await edgeChromium.executablePath) || LOCAL_CHROME_EXECUTABLE;

  const browser = await puppeteer.launch({
    executablePath,
    args: edgeChromium.args,
    headless: false,
  });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle2" });

  const content = await page.content();
  await browser.close();

  return content;
}

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
