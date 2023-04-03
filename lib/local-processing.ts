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
