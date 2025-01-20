import { BaseChecker } from "@/src/model/baseChecker";
import { DexScreenerGetter } from "../module/dexScreenerGetter";
import { UrlChecker } from "../module/urlChecker";

interface IReferenceChecker {}

/**
 * ReferenceChecker
 * @implements {IReferenceChecker}
 * @description This class is responsible for checking the reference of a project.
 * It should check the project's reference and verify it. It include website, whitepaper, github and twitter curretly.
 */
export class ReferecneChecker extends BaseChecker implements IReferenceChecker {
  address: string;

  constructor(address: string) {
    super();
    this.address = address;
  }

  public async check() {}

  public async getReference() {
    const reference = await new DexScreenerGetter().getTokenReference(
      this.address
    );

    return reference;
  }

  public async getReferenceInfo() {
    const references = await this.getReference();
    const referenceCheckResult = [];

    if (!references || references.length === 0)
      throw new Error("Failed to get reference");

    for (const ref of references) {
      const urlChecker = new UrlChecker(ref.url);
      const urlInfo = await urlChecker.getUrlInfo();
      referenceCheckResult.push({
        ...ref,
        urlInfo,
      });
    }
  }

  public async getReferenceMetadata() {
    const references = await this.getReference();
    const referenceCheckResult = [];

    if (!references || references.length === 0)
      throw new Error("Failed to get reference");

    for (const ref of references) {
      if (ref.label === "Docs" || ref.label === "Whitepaper") {
        const urlChecker = new UrlChecker(ref.url);
        const urlMetadata = await urlChecker.getUrlMetadata();
        referenceCheckResult.push({
          ...ref,
          urlMetadata,
        });
      }
    }

    return referenceCheckResult;
  }
}
