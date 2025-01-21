export class BaseGrowth {
  h24!: {
    price: number | null;
    volume: number | null;
    gap: number | null;
    faster: "volume" | "price";
  } | null;
  h6!: {
    price: number | null;
    volume: number | null;
    gap: number | null;
    faster: "volume" | "price";
  } | null;
  h1!: {
    price: number | null;
    volume: number | null;
    gap: number | null;
    faster: "volume" | "price";
  } | null;
  constructor() {}
}
