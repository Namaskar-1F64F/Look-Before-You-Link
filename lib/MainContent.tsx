import { Meta } from "lib/Meta";
import Head from "next/head";
import { useEffect } from "react";

export default function MainContent({ metadata, url }) {
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
