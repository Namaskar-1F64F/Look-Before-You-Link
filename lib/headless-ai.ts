import { Configuration, OpenAIApi } from "openai";
import { Metadata } from "./content-processing";
import redis from "./redis";
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const context = ({ content }: Metadata) => `
  site content in markdown: ${content.markdown}
  `;
const GET_COMBINED_PROMPT = (
  metadata: Metadata
) => `I would like you to create the title of this website, a description of the website, and a fun fact about the website. the title should be descriptive and short. the description must be between 140 and 160 characters. the fun fact should also be between 140 and 160 characters. This fact should preferably be about statistics that seem important. If it was a tiwtter post, for example, the important stats would be likes and re-tweets. do not mention that it is fun.  use the following context to help. answer with definitive language. possibly incorporate the name of the website or the tagline. The output should be as follows:

title:
description:
fun fact:

${context(metadata)}
`;

export type Meta = {
  title: string;
  description: string;
  fun: string;
};

export const getMeta = async (
  url: string,
  metadata: Metadata
): Promise<Meta> => {
  return new Promise(async (resolve, reject) => {
    // Check if the meta is in cache
    redis.get(`meta-${url}`, async (err, cachedMeta) => {
      if (err) {
        reject(err);
      }

      if (cachedMeta) {
        // Return the cached meta
        resolve(JSON.parse(cachedMeta));
      } else {
        // Generate the meta and store it in cache
        try {
          const metaRequest = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: GET_COMBINED_PROMPT(metadata),
            temperature: 0.2,
            max_tokens: 500,
          });

          const metaResponse = metaRequest.data.choices[0].text;
          const [title, description, fun] = metaResponse
            .split("\n")
            .map((line) => {
              const [, value] = line.split(":");
              return value.trim();
            });

          const result = { title, description, fun };

          redis.setex(`meta-${url}`, 60 * 60 * 72, JSON.stringify(result));

          resolve(result);
        } catch (error) {
          console.error(`Error generating meta from ${url}:`, error);
          resolve({ title: null, description: null, fun: null });
        }
      }
    });
  });
};
