import { BaseCheckResult } from "./baseCheckResult";

interface IReferenceCheckResult {}

/**
 * ReferenceCheckResult
 * @implements {IReferenceCheckResult}
 * @description This class is responsible for checking the reference of a project.
 * It should check if the project has a reference.
 */

export class ReferenceCheckResult
  extends BaseCheckResult
  implements IReferenceCheckResult
{
  constructor() {
    const score = 0;
    super(score);
  }
}
