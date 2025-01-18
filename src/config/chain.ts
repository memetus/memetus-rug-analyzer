import { Connection } from "@solana/web3.js";
import { nodeEndpoint } from "@/config/rpc";

/**
 * TODO: should update to use the connection pool
 */
export const createConnection = async () => {
  let connection: Connection | null = null;

  const endpoints = [
    nodeEndpoint["instantNode"],
    nodeEndpoint["helius"],
    nodeEndpoint["quickNode"],
  ];

  for (const endpoint of endpoints) {
    try {
      connection = new Connection(endpoint);
      await connection.getVersion();
      break;
    } catch (e) {
      console.log(`Failed to connect to ${endpoint}`);
    }
  }

  if (!connection) {
    throw new Error("Failed to connect to Solana network");
  }

  return connection;
};
