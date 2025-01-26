import { ChatOpenAI } from "@langchain/openai";
import dotenv from "dotenv";
import { getEnv } from "@/src/utils/env";
import { convertToOpenAITool } from "@langchain/core/utils/function_calling";
import { StructuredToolInterface } from "@langchain/core/tools";
import { Annotation, messagesStateReducer } from "@langchain/langgraph";
import { BaseMessage } from "@langchain/core/messages";

dotenv.config();

/**
 * @description create llm instance by model id
 * @param modelId # finetuned model id, for private
 */

export const createModel = ({ modelId }: { modelId: string }) => {
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
export const createModelWithTool = ({
  modelId,
  tools,
}: {
  modelId: string;
  tools: StructuredToolInterface[];
}) => {
  const apiKey = getEnv("OPENAI_API_KEY");
  const openAITools = tools.map((tool) => convertToOpenAITool(tool));

  const model = new ChatOpenAI({
    apiKey,
    model: modelId,
    temperature: 0,
  }).bind({
    tools: [...openAITools],
    tool_choice: {
      type: "function",
      function: { name: "search-tool" },
    },
  });

  return model;
};

export const createAgentState = () => {
  const state = Annotation.Root({
    messages: Annotation<BaseMessage[]>({
      reducer: messagesStateReducer,
    }),
  });

  return state;
};
