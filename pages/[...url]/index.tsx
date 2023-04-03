import { getMeta } from "lib/headless-ai";
import { fetchWebsiteContent, getSummaryFromText } from "lib/headless-chrome";
import { Meta } from "lib/Meta";

export async function getServerSideProps(context) {
  const url = context.query.url.join("/").replace("https:/", "https://");
  const content = await fetchWebsiteContent(url);
  const summary = await getSummaryFromText(content);
  const generated = await getMeta(summary);

  const metadata = {
    title: summary.title || generated.title,
    description: summary.description || generated.description,
    url: url,
    image:
      summary.image ||
      `https://sven.soy/og?title=${
        summary.title || generated.title
      }&description=${generated.fun}`,
  };
  return {
    props: {
      metadata,
      url,
    },
  };
}

export default function Page({ metadata, url }) {
  if (!metadata) return null;

  setTimeout(() => {
    if (window) {
      window.location.href = url;
    }
  });

  return (
    <Meta
      title={metadata.title}
      description={metadata.description}
      image={metadata.image}
      url={url}
    />
  );
}
