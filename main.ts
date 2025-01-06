import { HolderChecker } from "@/src/module/checker/holderChecker";
import { Connection, PublicKey } from "@solana/web3.js";
import { nodeEndpoint } from "@/src/constant/solana-cluster-url";

export default class MemetusRugChecker {
  connection: Connection;
  holderChecker: HolderChecker;

  constructor() {
    this.connection = new Connection(nodeEndpoint["quickNode"], "confirmed");

    console.log(this.connection);
    this.holderChecker = new HolderChecker({
      connection: this.connection,
      tokenAddress: new PublicKey(
        "7Uuzh9JwqF8z3u6MWpQuQJbpD1u46xPDY6PGjwfwTh4o"
      ),
      creator: new PublicKey("3DBzxVrhNaFTLAcdP9kkiZxFTtBoMb1LYww6n1NUYdzx"),
    });
  }
}

function main() {
  const memetusRugChecker = new MemetusRugChecker();
  memetusRugChecker.holderChecker.check().then((response) => {
    console.log(response);
  });
}

main();
