import { nodeEndpoint } from "@/src/config/rpc";

export type SolanaRpcType = keyof typeof nodeEndpoint;
