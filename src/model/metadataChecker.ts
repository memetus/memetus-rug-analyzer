import { BaseChecker } from "@/src/model/baseChecker";
import { Connection, ParsedTransaction, PublicKey } from "@solana/web3.js";
import { AddressChecker } from "@/src/module/addressChecker";
import { getMint } from "@solana/spl-token";
import {
  PUMPFUN_MINT_AUTHORITY,
  SYSTEM_PROGRAM_ID,
  TIMELOCK_ADDRESS,
} from "@/src/constant/address";
import { parseTokenAccountData } from "@/src/lib/parseAccount";
import { logger } from "@/src/config/log";
import { LockCheckerShape } from "@/src/types/lock";
import { MetadataCheckResult } from "@/src/data/result/metadataCheckResult";
import { MetadataShape } from "@/src/types/metadata";

interface IMetadataChecker {}

/**
 * MetadataChecker
 * @implements {IMetadataChecker}
 * @description This class is responsible for checking the metadata of a project.
 * It should check the name, symbol, description, mutability, mintability, freezability and total supply of the project.
 */

export class MetadataChecker extends BaseChecker implements IMetadataChecker {
  address: PublicKey;
  connection: Connection;

  constructor(address: string, connection: Connection) {
    super();
    this.address = new PublicKey(address);
    this.connection = connection;
  }

  public async check() {
    const baseMetadata = await this.getBaseMetadata();
    const { address, balance, metaplexPda, signature, token } =
      await this.getCreatorInfo();
    const lockInfo = await this.isCreatorLocked({ address, signature, token });
    const checkResult = new MetadataCheckResult();

    const data: MetadataShape = {
      name: baseMetadata.name,
      symbol: baseMetadata.symbol,
      primarySold: baseMetadata.primarySold,
      mutability: baseMetadata.mutability,
      mintbility: baseMetadata.mintability,
      freezability: baseMetadata.freezability,
      pumpfun: baseMetadata.pumpfun,
      creatorAddress: address,
      metaplexPda: metaplexPda,
      creatorBalance: balance,
      isCreatorLocked: lockInfo ? true : false,
      isCreatorSold: false,
    };
    return checkResult.setData({ data }).then(async (result) => {
      return await checkResult.getScore();
    });
  }

  public async getTokenCreaetionSignature() {
    const addressChecker = new AddressChecker();
    const pda = await addressChecker.getMetaplexPda(this.address.toBase58());

    if (!pda) throw new Error("Failed to get pda");
    const signatures = await this.connection.getSignaturesForAddress(pda, {});

    if (!signatures || signatures.length === 0 || !signatures[0]) {
      throw new Error("No signatures found");
    }

    return {
      signature: signatures[signatures.length - 1].signature,
      metaplexPda: pda.toBase58(),
    };
  }

  public async getTokenCreator() {
    const { signature, metaplexPda } = await this.getTokenCreaetionSignature();

    const transaction = await this.connection.getParsedTransaction(signature, {
      maxSupportedTransactionVersion: 0,
    });

    if (!transaction) throw new Error("Failed to get transaction");

    const creator =
      transaction.transaction.message.accountKeys[0].pubkey.toBase58();

    return { signature, creator, metaplexPda };
  }

  public async isCreatorLocked(creatorInfo: {
    address: string;
    signature: string;
    token: string;
  }) {
    try {
      const signatures = await this.connection.getSignaturesForAddress(
        new PublicKey(creatorInfo.token),
        {
          until: creatorInfo.signature,
        }
      );

      if (!signatures || signatures.length === 0) {
        console.log("No signatures found");
        logger.error("No signatures found");
        throw new Error("No signatures found");
      }

      const sigs = signatures.map((sig) => sig.signature);
      const txDetails = await this.connection.getParsedTransactions(sigs, {
        maxSupportedTransactionVersion: 0,
      });

      for (const tx of txDetails) {
        if (tx && tx.transaction.message.instructions) {
          for (const instruction of tx.transaction.message.instructions) {
            if (
              instruction.programId.toBase58() === TIMELOCK_ADDRESS.STREAMFLOW
            ) {
              return this.isStreamFlowLock(creatorInfo.address, tx.transaction);
            }
          }
        }
      }
    } catch (error) {
      console.error(error);
      logger.error("Failed to check lock", error);
      throw new Error("Failed to check lock");
    }
  }

  public async getCreatorTransaction() {
    const { token, signature, address } = await this.getCreatorInfo();
    const signatures = await this.connection.getSignaturesForAddress(
      new PublicKey(token),
      {
        until: signature,
      }
    );

    if (!signatures || signatures.length === 0) {
      console.log("No signatures found");
      logger.error("No signatures found");
      throw new Error("No signatures found");
    }

    const transfers = [];

    const sigs = signatures.map((sig) => sig.signature);
    const txDetails = await this.connection.getParsedTransactions(sigs, {
      maxSupportedTransactionVersion: 0,
      commitment: "confirmed",
    });

    if (!txDetails) {
      console.log("Failed to get transaction details");
      logger.error("Failed to get transaction details");
      throw new Error("Failed to get transaction details");
    }

    for (const tx of txDetails) {
      if (tx?.meta?.logMessages?.toString().includes("TransferChecked")) {
        const ins = tx.transaction.message.instructions;
        for (const item of ins) {
          if (
            "parsed" in item &&
            item.parsed &&
            item.parsed.type == "transferChecked"
          ) {
            const { destination, source, tokenAmount } = item.parsed.info;
            const amount = tokenAmount.uiAmount;
            if (destination.toString() == token.toString()) {
              const account = await this.connection.getParsedAccountInfo(
                new PublicKey(source)
              );
              // @ts-ignore
              const owner = account.value?.data?.parsed?.info.owner;
              if (owner) {
                transfers.push({
                  type: "receive",
                  from: owner,
                  to: address,
                  amount,
                });
              }
            } else if (source.toString() == token.toString()) {
              const account = await this.connection.getParsedAccountInfo(
                new PublicKey(destination)
              );
              // @ts-ignore
              const owner = account.value?.data?.parsed?.info.owner;
              if (owner) {
                transfers.push({
                  type: "send",
                  from: address,
                  to: owner,
                  amount,
                });
              }
            }
          }
        }
      } else if (tx?.meta?.logMessages?.toString().includes("Transfer")) {
        const ins = tx.transaction.message.instructions;
        for (const item of ins) {
          if (
            "parsed" in item &&
            item.parsed &&
            item.parsed.type == "transfer"
          ) {
            const { destination, source, tokenAmount } = item.parsed.info;
            const amount = tokenAmount.uiAmount;
            if (destination.toString() == token.toString()) {
              const account = await this.connection.getParsedAccountInfo(
                new PublicKey(source)
              );
              // @ts-ignore
              const owner = account.value?.data?.parsed?.info.owner;
              if (owner) {
                transfers.push({
                  type: "receive",
                  from: owner,
                  to: address,
                  amount,
                });
              }
            } else if (source.toString() == token.toString()) {
              const account = await this.connection.getParsedAccountInfo(
                new PublicKey(destination)
              );
              // @ts-ignore
              const owner = account.value?.data?.parsed?.info.owner;
              if (owner) {
                transfers.push({
                  type: "send",
                  from: address,
                  to: owner,
                  amount,
                });
              }
            }
          }
        }
      }
    }
    return transfers;
  }

  public async isStreamFlowLock(creator: string, tx: ParsedTransaction) {
    try {
      const checker: LockCheckerShape = {
        programId: [],
        token: null,
        amount: 0,
      };
      const ins = tx.message.instructions;

      for (const instruction of ins) {
        if (
          instruction.programId.toBase58() === TIMELOCK_ADDRESS.STREAMFLOW ||
          instruction.programId.toBase58() === SYSTEM_PROGRAM_ID
        ) {
          checker.programId.push(instruction.programId.toBase58());
        }
      }

      checker.token = tx.message.accountKeys[3].pubkey.toBase58();
      const balance = await this.connection.getTokenAccountsByOwner(
        new PublicKey(checker.token),
        {
          mint: this.address,
        }
      );

      const parsed = parseTokenAccountData(balance.value[0].account.data);
      checker.amount = parseFloat(parsed.amount.toString().slice(0, -6));

      return checker;
    } catch (error) {
      console.error(error);
      logger.error("Failed to check lock", error);
      throw new Error("Failed to check lock");
    }
  }

  public async getCreatorInfo() {
    const { signature, creator, metaplexPda } = await this.getTokenCreator();

    const tokenInfo = await this.connection.getTokenAccountsByOwner(
      new PublicKey(creator),
      {
        mint: this.address,
      }
    );

    if (!tokenInfo) throw new Error("Failed to get creator balance");

    const parsed = parseTokenAccountData(tokenInfo.value[0].account.data);

    if (!parsed) throw new Error("Failed to parse creator balance");

    return {
      address: creator,
      signature: signature,
      mint: this.address.toBase58(),
      token: tokenInfo.value[0].pubkey.toBase58(),
      balance: parseFloat(parsed.amount.toString().slice(0, -6)),
      metaplexPda: metaplexPda,
    };
  }

  public async getBaseMetadata() {
    try {
      const addressChecker = new AddressChecker();
      const metadata = await addressChecker.getTokenMetadata(
        this.address.toBase58()
      );

      const mintInfo = await getMint(
        this.connection,
        new PublicKey(this.address)
      );

      if (!metadata || !mintInfo) throw new Error("Failed to get metadata");
      return {
        name: metadata.name,
        symbol: metadata.symbol,
        address: this.address,
        primarySold: metadata.primarySaleHappened,
        initialized: mintInfo.isInitialized,
        mutability: metadata.isMutable,
        mintability: mintInfo.mintAuthority === null ? false : true,
        freezability: mintInfo.freezeAuthority === null ? false : true,
        pumpfun: metadata.updateAuthority === PUMPFUN_MINT_AUTHORITY,
      };
    } catch (error) {
      console.error(error);
      throw new Error("Failed to get metadata");
    }
  }
}
