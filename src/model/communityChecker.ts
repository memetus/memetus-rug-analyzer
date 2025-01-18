import { BaseChecker } from "@/src/model/baseChecker";

interface ICommunityChecker {}

/**
 * CommunityChecker
 * @implements {ICommunityChecker}
 * @description This class is responsible for checking the community of a project.
 * It should check if the project has a community, It include social media link e.g. telegram, discord curretly.
 */
export class CommunityChecker
  extends BaseChecker
  implements ICommunityChecker {}
