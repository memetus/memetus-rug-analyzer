import { BaseCheckResult } from "./baseCheckResult";

interface IMetadataCheckResult {}

/**
 * MetadataCheckResult
 * @implements {IMetadataCheckResult}
 * @description This class is responsible for checking the metadata of a project.
 * It should check if the project has a metadata.
 */

export class MetadataCheckResult
  extends BaseCheckResult
  implements IMetadataCheckResult
{
  constructor(score: number) {
    super(score);
  }
}
