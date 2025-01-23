import { createModelWithTool } from "@/src/config/agent";
import { getEnv } from "@/src/utils/env";

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

  constructor() {
    const modelId = getEnv("MODEL_ID");
    this.model = createModelWithTool({ modelId, tools: [] });
  }
}
