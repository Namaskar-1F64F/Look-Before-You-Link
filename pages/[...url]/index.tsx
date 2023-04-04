import { generateMetadataFromText } from "lib/headless-ai";
import { fetchWebsiteContentOrDie } from "lib/thats-so-fetch";
import { getMarkdownFromHtml, parseUrlOrDie } from "lib/content-processing";
import MainContent from "lib/components/MainContent";
import { SiteMetadata, GeneratedMedatada, HTMLMetadata } from "lib/types";
import {
  DEFAULT_CACHE_TIME,
  GENERATED_METADATA_KEY,
  redisClient,
} from "lib/api/redis";

const mergeMetadata = (
  url: string,
  parsedFromWebsite: HTMLMetadata,
  metadataFromOpenai: GeneratedMedatada
) => {
  const {
    title: generatedTitle,
    description: generatedDescription,
    fun,
  } = metadataFromOpenai;
  const { title, description, image } = parsedFromWebsite;
  let imageToSend = image;
  if (image && image.startsWith("/")) {
    imageToSend = url.replace(/\/$/, "") + image;
  } else {
    imageToSend = `https://sven.soy/og?title=${encodeURI(
      title || generatedTitle
    )}&description=${encodeURI(fun)}`;
  }
  imageToSend = imageToSend.replace(/%25/g, "%2525").replace("#", "%23");
  return {
    title: title || generatedTitle,
    description: description || generatedDescription,
    url,
    image: imageToSend,
  };
};

const getMetadataOrDie = async (url) => {
  const generatedMetadataFromCache = await redisClient.get(
    GENERATED_METADATA_KEY(url)
  );
  if (generatedMetadataFromCache) {
    return JSON.parse(generatedMetadataFromCache);
  }
  const rawHtml = await fetchWebsiteContentOrDie(url);
  const websiteMarkdownSummary: HTMLMetadata = await getMarkdownFromHtml(
    rawHtml
  );
  const metadataFromOpenai: GeneratedMedatada = await generateMetadataFromText(
    websiteMarkdownSummary.content.markdown
  );

  const mergedMetadata = mergeMetadata(
    url,
    websiteMarkdownSummary,
    metadataFromOpenai
  );

  await redisClient.setex(
    GENERATED_METADATA_KEY(url),
    DEFAULT_CACHE_TIME,
    JSON.stringify(mergedMetadata)
  );

  return mergedMetadata;
};

export async function getServerSideProps(context) {
  const url = parseUrlOrDie(context.req.url);
  const metadata: SiteMetadata = await getMetadataOrDie(url);

  return {
    props: {
      metadata,
      url,
    },
  };
}

export default function Metadata({
  metadata,
  url,
}: {
  metadata: SiteMetadata;
  url: string;
}) {
  return <MainContent metadata={metadata} url={url} />;
}
