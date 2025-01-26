import { CheckData } from "@/src/types/provider";

interface IMemetusRugChecker {}

/**
 * MemetusRugChecker
 * @implements {IMemetusRugChecker}
 * @description This class is responsible for aggregate all checker in single module.
 * It should contain communityChecker, holderChecker, liquidityChecker, marketChecker, metadataChecker, referenceChecker, websiteChecker.
 */

export class MemetusRugChecker implements IMemetusRugChecker {
  data: CheckData;
  constructor(data: CheckData) {
    this.data = data;
  }

  public async checkAll() {}
}
