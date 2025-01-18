import { BaseChecker } from "@/src/model/baseChecker";

interface IReferenceChecker {}

/**
 * ReferenceChecker
 * @implements {IReferenceChecker}
 * @description This class is responsible for checking the reference of a project.
 * It should check the project's reference and verify it. It include website, whitepaper, github and twitter curretly.
 */
export class IReferecneChecker
  extends BaseChecker
  implements IReferenceChecker {}
