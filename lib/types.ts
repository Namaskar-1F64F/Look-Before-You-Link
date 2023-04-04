export type GeneratedMedatada = {
  title: string;
  description: string;
  fun: string;
};

export type HTMLMetadata = {
  title: string;
  description: string;
  image: string;
  content: {
    markdown: string;
  };
  rawHtml: string;
};

export type SiteMetadata = {
  title: string;
  description: string;
  url: string;
  image: string;
};
