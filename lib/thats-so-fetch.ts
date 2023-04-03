export async function fetchWebsiteContent(url) {
  try {
    const response = await fetch(url);
    const status = response.status;

    if (response.ok) {
      const content = await response.text();
      return { content, status };
    } else {
      console.error(`Error fetching content from ${url}: ${status}`);
      return { content: "", status };
    }
  } catch (error) {
    console.error(`Error fetching content from ${url}:`, error);
    return { content: "", status: 500 };
  }
}
