import { BaseCheckResult } from "./baseCheckResult";

interface ICommunityCheckResult {}

/**
 * CommunityCheckResult
 * @implements {ICommunityCheckResult}
 * @description This class is responsible for checking the community of a project.
 * It should check if the project has a community.
 */

export class CommunityCheckResult
  extends BaseCheckResult
  implements ICommunityCheckResult
{
  constructor(score: number) {
    super(score);
  }
}
