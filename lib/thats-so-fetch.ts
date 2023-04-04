export async function fetchWebsiteContentOrDie(url): Promise<string> {
  const response = await fetch(url);
  const status = response.status;
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url} with status ${status}`);
  }
  return await response.text();
}
