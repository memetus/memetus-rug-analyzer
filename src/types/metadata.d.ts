export type MetadataShape = {
  name: string | undefined;
  symbol: string | undefined;
  mutability: boolean;
  mintbility: boolean;
  freezability: boolean;
  pumpfun: boolean;
  metaplexPda: string | undefined;
  creatorAddress: string | undefined;
  creatorBalance: number;
  isCreatorLocked: boolean;
  creatorTransfer: {
    type: "send" | "receive";
    from: string;
    to: string;
    amount: number;
  }[] = [];
  creatorSellCount: number = 0;
};
