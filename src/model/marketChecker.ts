import { BaseChecker } from "@/src/model/baseChecker";
import { Connection } from "@solana/web3.js";

interface IMarketChecker {}

/**
 * MarketChecker
 * @implements {IMarketChecker}
 * @description This class is responsible for checking the market of a project.
 * It should check the project's market cap, volume, and price.
 */
export class MarketChecker extends BaseChecker implements IMarketChecker {
  address: string;
  connection: Connection;

  constructor(address: string, connection: Connection) {
    super();
    this.address = address;
    this.connection = connection;
  }
}
