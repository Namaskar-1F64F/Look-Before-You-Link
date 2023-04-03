import redis from "./redis";

export async function fetchWebsiteContent(
  url
): Promise<{ content: string; status: number }> {
  return new Promise(async (resolve, reject) => {
    redis.get(url, async (err, cachedContent) => {
      if (err) {
        reject(err);
      }

      if (cachedContent) {
        resolve(JSON.parse(cachedContent));
      } else {
        try {
          const response = await fetch(url);
          const status = response.status;

          if (response.ok) {
            const content = await response.text();

            const result = { content, status };

            redis.setex(url, 60 * 60 * 3, JSON.stringify(result));

            resolve(result);
          } else {
            console.error(`Error fetching content from ${url}: ${status}`);
            resolve({ content: "", status });
          }
        } catch (error) {
          console.error(`Error fetching content from ${url}:`, error);
          resolve({ content: "", status: 500 });
        }
      }
    });
  });
}
