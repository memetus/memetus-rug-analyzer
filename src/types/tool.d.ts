import { DynamicStructuredTool } from "@langchain/core/tools";
import z from "zod";

export type SearchTool = DynamicStructuredTool<
  z.ZodObject<
    {
      messages: z.ZodArray<z.ZodString>;
    },
    "strip",
    z.ZodTypeAny,
    {
      messages: string[];
    }
  >
>;
