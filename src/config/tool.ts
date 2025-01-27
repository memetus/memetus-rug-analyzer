import { DynamicStructuredTool, tool } from "@langchain/core/tools";
import { z } from "zod";
import { tavily } from "@tavily/core";
import { getEnv } from "@/src/utils/env";
import { HumanMessage } from "@langchain/core/messages";

export const getSearchTool = new DynamicStructuredTool({
  name: "search-tool",
  description: "Search tool for langgraph tool",
  schema: z.object({
    // content: z.string(),
    messages: z.array(z.string()),
  }),
  func: async ({ messages }: { messages: string[] }) => {
    const searchResult = await extractSearch({ messages });

    return searchResult;
  },
});

/**
 * @description create search url tool for langgraph tool
 * @returns langgrah tool for multi agent interaction
 */
export const createSearchTool = async () => {
  const customTool = tool(
    async ({ messages }: { messages: string[] }) => {
      const searchResult = await extractSearch({ messages });

      return searchResult;
    },
    {
      ...getSearchTool,
    }
  );

  return customTool;
};

export const createTavilyClient = () => {
  const apiKey = getEnv("TAVILY_API_KEY");
  const tavilyClient = tavily({
    apiKey,
  });

  return tavilyClient;
};

/**
 *
 * @param urls
 * @description use tavily to extract information from urls
 * @returns searchResult
 */
export const extractSearch = async ({ messages }: { messages: string[] }) => {
  try {
    const tavilyClient = createTavilyClient();

    const serachResult = await tavilyClient.extract(messages);
    const joinedResult = serachResult.results.map((result) => {
      return new HumanMessage(result.rawContent);
    });

    return {
      messages: joinedResult,
    };
  } catch (error) {
    throw new Error(`Failed to search urls ${error as string}`);
  }
};
