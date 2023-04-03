export function Meta({ description, image, title, url }) {
  return (
    <head>
      <title>{title}</title>
      <meta name="description" content={description} />

      <meta itemProp="name" content="My writing." />
      <meta itemProp="description" content={description} />
      <meta
        itemProp="image"
        content={image}
      />

      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta
        property="og:image"
        content={image}
      />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta
        name="twitter:image"
        content={image}
      />
    </head>
  );
}
