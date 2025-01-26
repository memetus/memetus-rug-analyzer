export type WebsiteShape = {
  url: string;
  label: string;
  ip: string;
  city: string;
  region: string;
  country: string;
  loc: string;
  postal: string;
  timezone: string;
  anycast: boolean;
  name: string;
  description: string;
  keywords: string;
  canonical: string | undefined;
  author: string;
  generator: string;
};

export type WebsiteData = {
  total: nummber;
  urls: WebsiteShape[];
};

export type UrlPair = {
  label: string;
  url: string;
};
