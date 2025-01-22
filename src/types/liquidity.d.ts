export type LPInfo = {
  name: string;
  pair: string;
  liquidity: number;
  lpPercentage: number;
};

export type LiquidityLockedInfo = {
  supply: number;
  burnAmount: number;
  burnPercentage: number;
  isLocked: boolean;
  pair: string;
};
