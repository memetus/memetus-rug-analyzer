export type Txn = { buy: number; sell: number };

export type Volume = { m5: number; h1: number; h6: number; h24: number };

export type DataChangeShpae = { h1: number; h6: number; h24: number };

export type MarketData = {
  priceNative: number;
  priceUsd: number;
  m5Txns: Txn;
  h1Txns: Txn;
  h6Txns: Txn;
  h24Txns: Txn;
  volume: Volume;
  volumeChange: DataChangeShpae;
  priceChange: DataChangeShpae;
  marketCap: number;
  fdv: number;
  marketGrowth: BaseGrowth;
};
