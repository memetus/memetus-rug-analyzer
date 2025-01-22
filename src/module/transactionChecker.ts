import { ParsedTransactionWithMeta } from "@solana/web3.js";
import { DEX_ADDRESS } from "@/src/constant/address";
import { LIQUIDITY_STATE_LAYOUT_V4 } from "@raydium-io/raydium-sdk";
import bs58 from "bs58";

interface ITransactionChecker {}

/**
 * TransactionChecker
 * @implements {ITransactionChecker}
 * @description This class is responsible for checking the transaction of a project.
 * It should check if the project has a transaction.
 */

export class TransactionChecker implements ITransactionChecker {
  constructor() {}

  public parseTransfer(
    txs: (ParsedTransactionWithMeta | null)[],
    filter: string
  ) {
    const transactions = [];

    for (const tx of txs) {
      if (tx && tx.transaction.message.instructions) {
        for (const instruction of tx.transaction.message.instructions) {
        }
      }
    }

    return [];
  }

  public parseRaydiumSwap(
    txs: (ParsedTransactionWithMeta | null)[],
    address: string
  ) {
    const transactions = [];

    for (const tx of txs) {
      if (tx && tx.transaction.message.instructions) {
        for (const instruction of tx.transaction.message.instructions) {
        }
      }
    }
    return [];
  }

  public parseJupiterSwap(
    tsx: (ParsedTransactionWithMeta | null)[],
    address: string
  ) {
    const transactions = [];

    for (const tx of tsx) {
      if (tx && tx.transaction.message.instructions) {
        for (const instruction of tx.transaction.message.instructions) {
        }
      }
    }

    return [];
  }

  public parseMeteoraSwap(
    tsx: (ParsedTransactionWithMeta | null)[],
    address: string
  ) {
    const transactions = [];

    for (const tx of tsx) {
      if (tx && tx.transaction.message.instructions) {
        for (const instruction of tx.transaction.message.instructions) {
        }
      }
    }

    return [];
  }
}
