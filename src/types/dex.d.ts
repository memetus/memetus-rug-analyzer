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
