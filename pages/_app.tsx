import Head from "next/head";
import "../lib/landing.css";
export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>👀 Look Before you Link</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="Look Before You Link - Preview websites and get a summary before clicking on a link"
        />
        <meta
          name="keywords"
          content="link, preview, summary, website, look before you link"
        />
        <meta name="author" content="Your Name" />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://lookbeforeyou.link" />
        <meta property="og:title" content="Look Before You Link" />
        <meta
          property="og:description"
          content="Preview websites and get a summary before clicking on a link"
        />
        <meta
          property="og:image"
          content="https://lookbeforeyou.link/og-image.jpg"
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://lookbeforeyou.link" />
        <meta name="twitter:title" content="Look Before You Link" />
        <meta
          name="twitter:description"
          content="Preview websites and get a summary before clicking on a link"
        />
        <meta
          name="twitter:image"
          content="https://lookbeforeyou.link/twitter-image.jpg"
        />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
