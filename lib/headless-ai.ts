import { Configuration, OpenAIApi } from "openai";
import { Metadata } from "./content-processing";
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const context = ({ content }: Metadata) => `
  headings: These are important: ${content.headings
    .map((heading) => heading.text)
    .join(", ")}
  paragraphs: this content is important ${content.paragraphs
    .map((paragraph) => paragraph.text)
    .join(" ")}
  tables: this content is important ${content.tables
    .map((table) => JSON.stringify(table, null, 2))
    .join(" ")}
  `;
const GET_TITLE_PROMPT = (
  metadata: Metadata
) => `I would like you to create the title of this website.  use the following context to help. answer with definitive language. this title needs to be descriptive and short. possibly incorporate the name of the website or the tagline.

${context(metadata)}
`;

const GET_DESCRIPTION_PROMPT = (
  metadata: Metadata
) => `I would like you to create the description of this website. it must be between 140 and 160 characters. use the following context to help. answer with definitive language.

${context(metadata)}
`;

const GET_FUN_PROMPT = (
  metadata: Metadata
) => `I would like you to create a fun fact about this website. use the following context to help. answer with definitive language.

${context(metadata)}
`;

export type Meta = {
  title: string;
  description: string;
  fun: string;
};

export const getMeta = async (metadata: Metadata): Promise<Meta> => {
  const titleRequest = openai.createCompletion({
    model: "text-davinci-003",
    prompt: GET_TITLE_PROMPT(metadata),
    temperature: 0.5,
    max_tokens: 200,
  });
  const descriptionRequest = openai.createCompletion({
    model: "text-davinci-003",
    prompt: GET_DESCRIPTION_PROMPT(metadata),
    temperature: 0.5,
    max_tokens: 200,
  });
  const funRequest = openai.createCompletion({
    model: "text-davinci-003",
    prompt: GET_FUN_PROMPT(metadata),
    temperature: 0.5,
    max_tokens: 200,
  });

  const [titleResponse, descriptionResponse, funResponse] = await Promise.all([
    titleRequest,
    descriptionRequest,
    funRequest,
  ]);

  const title = titleResponse.data.choices[0].text;
  const description = descriptionResponse.data.choices[0].text;
  const fun = funResponse.data.choices[0].text;

  return { title, description, fun };
};
