import { getMeta } from "lib/headless-ai";
import { fetchWebsiteContent } from "lib/thats-so-fetch";
import { Meta } from "lib/Meta";
import Head from "next/head";
import { useEffect } from "react";
import { getSummaryFromText } from "lib/content-processing";

const urlRegex = new RegExp(
  "^(https?:\\/\\/)?" + // protocol
    "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
    "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
    "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
    "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
    "(\\#[-a-z\\d_]*)?$",
  "i" // fragment locator
);

export async function getServerSideProps(context) {
  const url = context.req.url.slice(1).replace("https:/", "https://");
  if (!urlRegex.test(url)) return { props: {} };
  const { content, status } = await fetchWebsiteContent(url);

  if (status !== 200) return { props: {} };

  const summary = await getSummaryFromText(content);
  const generated = await getMeta(summary);
  if (summary.image && summary.image.startsWith("/")) {
    summary.image = url.replace(/\/$/, "") + summary.image;
  }

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
  useEffect(() => {
    setTimeout(() => {
      if (typeof window !== "undefined") {
        window.location.href = url;
      }
    }, 10);
  });
  if (!metadata) return <></>;
  return (
    <Head>
      <Meta
        title={metadata.title}
        description={metadata.description}
        image={metadata.image}
        url={url}
      />
    </Head>
  );
}
