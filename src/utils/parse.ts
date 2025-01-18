import { Connection, ParsedTransactionWithMeta } from "@solana/web3.js";

export function safeJsonParse<T>(jsonString: string, fallback: T): T {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    return fallback;
  }
}

export const parseQueryString = (query: string): Record<string, string> => {
  return query
    .replace(/^\?/, "")
    .split("&")
    .reduce((acc, pair) => {
      const [key, value] = pair.split("=");
      acc[decodeURIComponent(key)] = decodeURIComponent(value || "");
      return acc;
    }, {} as Record<string, string>);
};

export const parseTx = async (txId: string, connection: Connection) => {
  const parsedTx: ParsedTransactionWithMeta | null =
    await connection.getParsedTransaction(txId, {
      maxSupportedTransactionVersion: 0,
      commitment: "confirmed",
    });

  return parsedTx;
};
