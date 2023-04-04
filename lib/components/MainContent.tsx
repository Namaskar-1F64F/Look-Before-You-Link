import { useEffect } from "react";
import Head from "next/head";

import { Metadata } from "lib/components/Metadata";

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
      <Metadata
        title={metadata.title}
        description={metadata.description}
        image={metadata.image}
        url={url}
      />
    </Head>
  );
}
