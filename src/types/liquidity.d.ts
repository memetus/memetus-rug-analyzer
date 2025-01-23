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

export type LiquidityData = {
  totalLiquidity: number;
  totalLpCount: number;
  totalLockedLiquidity: number;
  totalLockedLiquidityPercentage: number;
  lpLockedInfoList: (LiquidityLockedInfo | undefined)[];
  lpList: (LPInfo | undefined)[];
  marketCap: number | undefined;
};
