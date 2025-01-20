export type HeliusAssetResponseShape = {
  interface: string;
  id: string;
  content: {
    $schema: string;
    json_uri: string;
    files: {
      uri: string;
      cdn_uri: string;
      mime: string;
    }[];
    metadata: {
      description: string;
      name: string;
      symbol: string;
      token_standard: string;
    };
    links: { image: string };
  };
  compression: {
    eligible: boolean;
    compressed: boolean;
    data_hash: string;
    creator_hash: string;
    asset_hash: string;
    tree: string;
    seq: number;
    leaf_id: number;
  };
  royalty: {
    royalty_model: string;
    target: any;
    percent: number;
    basis_points: number;
    primary_sale_happened: boolean;
    locked: boolean;
  };
  ownership: {
    frozen: boolean;
    delegated: boolean;
    delegate: any;
    ownership_model: string;
    owner: string;
  };
  supply: number;
  mutable: boolean;
  burnt: boolean;
  token_info: {
    symbol: string;
    supply: number;
    decimals: number;
    token_program: string;
    price_info: number;
  };
};
