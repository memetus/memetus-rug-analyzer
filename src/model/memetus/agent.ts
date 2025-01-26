import {
  createAgentState,
  createModel,
  createModelWithTool,
} from "@/src/config/agent";
import { logger } from "@/src/config/log";
import { createSearchTool } from "@/src/config/tool";
import { SYSTEM_PROMPT } from "@/src/constant/prompt";
import { SearchTool } from "@/src/types/tool";
import { getEnv } from "@/src/utils/env";
import {
  AIMessage,
  BaseMessage,
  SystemMessage,
} from "@langchain/core/messages";
import { END, Messages, START, StateGraph } from "@langchain/langgraph";
import { StructuredToolInterface, Tool } from "@langchain/core/tools";

interface IMemetusRugAgent {}

/**
 * MemetusRugAgent
 * @implements {IMemetusRugAgent}
 * @description This class is responsible for determining the project type.
 * By the project types, checker module get weighted score.
 * e.g. for the animal themed project the metadata score is more important than the market score.
 */
export class MemetusRugAgent implements IMemetusRugAgent {
  model: ReturnType<typeof createModelWithTool>;
  tools: StructuredToolInterface[];
  state: ReturnType<typeof createAgentState>;
  workflow: StateGraph<BaseMessage[], Messages>;
  graph!: any;

  constructor(tool: SearchTool) {
    const modelId = getEnv("MODEL_ID");
    this.tools = [tool];
    this.state = createAgentState();
    this.model = createModelWithTool({ modelId, tools: this.tools });
    this.workflow = new StateGraph(this.state);
  }

  static async init() {
    const searchTool = await createSearchTool();
    return new MemetusRugAgent(searchTool);
  }

  public compile() {
    this.tools.forEach((tool) => {
      this.workflow.addNode("search", tool);
    });
    this.workflow.addNode("run", this.run.bind(this));

    this.workflow.addEdge(START, "search" as any);
    this.workflow.addEdge("search" as any, "run" as any);
    this.workflow.addEdge("run" as any, END);

    this.graph = this.workflow.compile();

    return this.graph;
  }

  public async run(state: typeof this.state.State) {
    try {
      const messages = [new SystemMessage(SYSTEM_PROMPT), ...state.messages];
      const modelId = getEnv("MODEL_ID");

      const response = await createModel({ modelId }).invoke(messages);
      console.log("response", response);

      return {
        messages: [new AIMessage(response.content.toString())],
      };
    } catch (error) {
      console.error(error);
      logger.error(error);
      throw new Error(`Failed to search ${error as string}`);
    }
  }
}
