import { ChatOpenAI } from "@langchain/openai";
import dotenv from "dotenv";
import { getEnv } from "@/src/utils/env";
import { ToolNode } from "@langchain/langgraph/prebuilt";

dotenv.config();

/**
 * @description create llm instance by model id
 * @param modelId # finetuned model id, for private
 */

export const createModel = async ({ modelId }: { modelId: string }) => {
  const apiKey = getEnv("OPENAI_API_KEY");

  const model = new ChatOpenAI({
    apiKey,
    model: modelId,
    temperature: 0,
  });

  return model;
};

/**
 * @description create llm instance by model id with sepcific langchain tool
 * @param modelId # finetuned model id, for private
 * @param tools # sepcific langchain tool
 */
export const createModelWithTool = async ({
  modelId,
  tools,
}: {
  modelId: string;
  tools: ToolNode[];
}) => {
  const apiKey = getEnv("OPENAI_API_KEY");

  const model = new ChatOpenAI({
    apiKey,
    model: modelId,
    temperature: 0,
  }).bindTools(tools);

  return model;
};
