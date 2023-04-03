import { getMeta } from "lib/headless-ai";
import { fetchWebsiteContent, getSummaryFromText } from "lib/headless-chrome";
import { Meta } from "lib/Meta";
import Head from "next/head";
import { useEffect } from "react";

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
  const url = context.query.url.join("/").replace("https:/", "https://");

  if (!urlRegex.test(url)) return { props: {} };

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
  if (!metadata) return <></>;
  console.log("meow");

  useEffect(() => {
    setTimeout(() => {
      if (typeof window !== "undefined") {
        // window.location.href = url;
      }
    }, 10);
  });

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
