import { Connection } from "@solana/web3.js";
import { nodeEndpoint } from "@/src/config/rpc";

/**
 * TODO: should update to use the connection pool
 */
export const createConnection = () => {
  let connection: Connection | null = null;

  const endpoints = [
    nodeEndpoint["instantNode"],
    nodeEndpoint["helius"],
    nodeEndpoint["quickNode"],
  ];

  for (const endpoint of endpoints) {
    try {
      connection = new Connection(endpoint);
      return connection;
    } catch (e) {
      console.log(`Failed to connect to ${endpoint}`);
    }
  }

  if (!connection) {
    throw new Error("Failed to connect to Solana network");
  }

  return connection;
};
