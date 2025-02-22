import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAccount,
  getAssociatedTokenAddress,
  getMint,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { DEX_ADDRESS } from "@/src/constant/address";
import { DexType } from "@/src/types/dex";
import { Connection, PublicKey } from "@solana/web3.js";
import { METADATA_PROGRAM_ID } from "@raydium-io/raydium-sdk-v2";
import { fetchMetadataFromSeeds } from "@metaplex-foundation/mpl-token-metadata";
import { createUmiEndpoint } from "@/src/config/chain";

interface IAddressChecker {}

export class AddressChecker implements IAddressChecker {
  constructor() {}

  public async getTokenAddress(address: string, userAddress: string) {
    const mintAddress = new PublicKey(address);
    const user = new PublicKey(userAddress);

    const tokenAddress = await getAssociatedTokenAddress(
      mintAddress,
      user,
      false,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
    );

    return tokenAddress;
  }

  public isDexAddress(address: string): { isDex: boolean; name?: DexType } {
    const dexList = Object.entries(DEX_ADDRESS).map(([key, value]) => {
      return {
        name: key as DexType,
        address: value,
      };
    });

    const isDex = dexList.find((dex) => dex.address === address);
    return { isDex: isDex ? true : false, name: isDex?.name };
  }

  public async getAddressType(address: string, connection: Connection) {
    try {
      const publicKey = new PublicKey(address);
      const accountInfo = await getAccount(connection, publicKey);

      return {
        type: "SPL_TOKEN_ACCOUNT",
        data: accountInfo,
      };
    } catch (error) {
      try {
        const publicKey = new PublicKey(address);
        const mintInfo = await getMint(connection, publicKey);

        return {
          type: "SPL_MINT_ACCOUNT",
          data: mintInfo,
        };
      } catch (error) {
        return {
          type: "WALLET_ACCOUNT",
        };
      }
    }
  }

  public async getMetaplexPda(address: string) {
    try {
      const [metadataPDA] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("metadata"),
          METADATA_PROGRAM_ID.toBuffer(),
          new PublicKey(address).toBuffer(),
        ],
        METADATA_PROGRAM_ID
      );

      return metadataPDA;
    } catch (err) {
      console.log(err);
    }
  }

  public async getTokenMetadata(address: string) {
    try {
      const umi = createUmiEndpoint();

      if (umi) {
        const metadata = await fetchMetadataFromSeeds(umi as any, {
          mint: new PublicKey(address) as any,
        });

        return metadata;
      }
    } catch (err) {
      console.log(err);
    }
  }
}
