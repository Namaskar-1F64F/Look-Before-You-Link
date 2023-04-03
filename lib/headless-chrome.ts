import edgeChromium from "chrome-aws-lambda";
import puppeteer from "puppeteer-core";

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

  const response = await page.goto(url, { waitUntil: "networkidle2" });
  const status = response.status();
  const content = await page.content();
  await browser.close();

  return { content, status };
}
