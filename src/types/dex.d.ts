import { DEX_ADDRESS } from "@/src/constant/address";

export type DexType = keyof typeof DEX_ADDRESS;

export type DexSupplyShape = {
  name: DexType;
  amount: number;
};

export type DexScreenerResponseShape = {
  chainId: string;
  dexId: string;
  url: string;
  pairAddress: string;
  baseToken: {
    address: string;
    name: string;
    symbol: string;
  };
  quoteToken: {
    address: string;
    name: string;
    symbol: string;
  };
  priceNative: string;
  priceUsd: string;
  liquidity: {
    usd: number;
    base: number;
    quote: number;
  };
  txns: {
    m5: {
      buy: number;
      sell: number;
    };
    h1: {
      buy: number;
      sell: number;
    };
    h6: {
      buy: number;
      sell: number;
    };
    h24: {
      buy: number;
      sell: number;
    };
  };
  volume: {
    m5: number;
    h1: number;
    h6: number;
    h24: number;
  };
  priceChange: {
    m5: number;
    h1: number;
    h6: number;
    h24: number;
  };
  fdv: number;
  marketCap: number;
  pairCreatedAt: number;
  info: {
    imageUrl: string;
    header: string;
    openGraph: string;
    websites: DexSceenerWebSiteShape[];
    socials: DexScreenerSocialShape[];
  };
};

export type DexSceenerWebSiteShape = {
  label: string;
  url: string;
};

export type DexScreenerSocialShape = {
  type: string;
  url: string;
};
