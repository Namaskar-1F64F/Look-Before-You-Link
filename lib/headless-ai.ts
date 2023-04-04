import { openaiClient } from "./api/openai";
import { GeneratedMedatada } from "./types";

const GET_COMBINED_PROMPT = (
  text: string
) => `I would like you to create the title of this website, a description of the website, and a fun fact about the website. the title should be descriptive and short. the description must be between 140 and 160 characters. the fun fact should also be between 140 and 160 characters. This fact should preferably be about statistics that seem important. If it was a tiwtter post, for example, the important stats would be likes and re-tweets. do not mention that it is fun.  use the following context to help. answer with definitive language. possibly incorporate the name of the website or the tagline. The output should be as follows:

title:
description:
fun fact:

site content in markdown: ${text}
`;

export const generateMetadataFromText = async (
  text: string
): Promise<GeneratedMedatada> => {
  const metaRequest = await openaiClient.createCompletion({
    model: "text-davinci-003",
    prompt: GET_COMBINED_PROMPT(text),
    temperature: 0,
    max_tokens: 500,
  });

  const metaResponse = metaRequest.data.choices[0].text;
  const metaResponseWithoutBlankLines = metaResponse.replace(/^\s*\n/gm, "");
  const [title, description, fun] = metaResponseWithoutBlankLines
    .split("\n")
    .map((line) => {
      const [, value] = line.split(":");
      return value?.trim();
    });
  return { title, description, fun };
};
