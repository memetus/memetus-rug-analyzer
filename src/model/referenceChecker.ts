import { BaseChecker } from "@/src/model/baseChecker";

interface IReferenceChecker {}

/**
 * ReferenceChecker
 * @implements {IReferenceChecker}
 * @description This class is responsible for checking the reference token of a project.
 * It should check the reference e.g. related project or related token of this project
 */

export class ReferenceChecker extends BaseChecker implements IReferenceChecker {
  address: string;

  constructor(address: string) {
    super();
    this.address = address;
  }
}
