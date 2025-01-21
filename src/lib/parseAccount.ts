import { PublicKey } from "@solana/web3.js";

export const parseTokenAccountData = (data: Buffer) => {
  const ACCOUNT_LAYOUT = {
    mint: [0, 32],
    owner: [32, 64],
    amount: [64, 72],
  };

  return {
    mint: new PublicKey(
      data.slice(ACCOUNT_LAYOUT.mint[0], ACCOUNT_LAYOUT.mint[1])
    ).toBase58(),
    amount: data.readBigUInt64LE(ACCOUNT_LAYOUT.amount[0]),
  };
};
