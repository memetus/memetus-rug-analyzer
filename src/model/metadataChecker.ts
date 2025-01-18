import { BaseChecker } from "@/src/model/baseChecker";

interface IMetadataChecker {}

/**
 * MetadataChecker
 * @implements {IMetadataChecker}
 * @description This class is responsible for checking the metadata of a project.
 * It should check the name, symbol, description, mutability, mintability, burnability, freezability and total supply of the project.
 */

export class MetadataChecker extends BaseChecker implements IMetadataChecker {}
