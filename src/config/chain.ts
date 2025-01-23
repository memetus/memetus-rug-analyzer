import { Connection } from "@solana/web3.js";
import { nodeEndpoint } from "@/src/config/rpc";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";

/**
 * TODO: should update to use the connection pool
 */
export const createConnection = () => {
  let connection: Connection | null = null;

  const endpoint = nodeEndpoint["helius"];

  try {
    connection = new Connection(endpoint, "confirmed");
    return connection;
  } catch (e) {
    console.log(`Failed to connect to ${endpoint}`);
  }

  if (!connection) {
    throw new Error("Failed to connect to Solana network");
  }

  return connection;
};

export const createUmiEndpoint = () => {
  const endpoints = nodeEndpoint["helius"];
  for (const endpoint of endpoints) {
    try {
      return createUmi(endpoint);
    } catch (e) {
      console.log(`Failed to connect to ${endpoint}`);
    }
  }
};
