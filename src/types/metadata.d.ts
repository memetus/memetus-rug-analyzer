export type MetadataShape = {
  name: string | undefined;
  symbol: string | undefined;
  primarySold: boolean;
  mutability: boolean;
  mintbility: boolean;
  freezability: boolean;
  pumpfun: boolean;
  metaplexPda: string | undefined;
  creatorAddress: string | undefined;
  creatorBalance: number;
  isCreatorLocked: boolean;
  isCreatorSold: boolean;
};
