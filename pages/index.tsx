import { extractCleanMetaTags } from "lib/local-processing";
import Head from "next/head";
import { useState, useRef } from "react";

declare global {
  interface Window {
    shiki: any;
  }
}

const LandingPage = () => {
  const [inputUrl, setInputUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const preRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (typeof window !== "undefined") {
      const response = await fetch(`/${inputUrl}`);
      const data = await response.text();
      const highlighter = await window.shiki.getHighlighter({ theme: "nord" });
      const html = highlighter.codeToHtml(extractCleanMetaTags(data), "html");
      preRef.current.innerHTML = html;
    }
    setLoading(false);
  };
  return (
    <>
      <Head>
        <script src="https://unpkg.com/shiki"></script>
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
      <div className="landing-page">
        <h1 className="title">
          Look before you <span className="animated-text">Link</span>
        </h1>
        <div className="steps">
          <ol>
            <li>🎯 Fetch the target website</li>
            <li>🔍 Extract the juicy info</li>
            <li>🧠 Send data to our LLM wizard for meta magic</li>
            <li>🌟 Voilà! Meta tags revealed and displayed</li>
            <li>🔗 Link seem worthy of a click?</li>
            <li>
              🚀 Click the link, and zoom! You're redirected to the target site
            </li>
          </ol>
        </div>
        <div className="demo">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="Enter a URL to preview"
            />
            <button type="submit">🧙‍♂️ AI Magic, Make it Happen! ✨</button>
          </form>
          {loading && <div className="loading">Loading...</div>}
          <div className="meta-data">
            <pre ref={preRef} />
          </div>
        </div>
        <p>
          Made with 🖐️ and 🤖 on{" "}
          <a href="https://github.com/Namaskar-1F64F/Look-Before-You-Link">
            GitHub
          </a>
        </p>
        <p className="privacy-note">
          We do not store any logs or user information.
        </p>
      </div>
    </>
  );
};

export default LandingPage;
