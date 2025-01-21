import { BaseChecker } from "@/src/model/baseChecker";
import { logger } from "@/src/config/log";
import axios from "axios";
import { getEnv } from "@/src/utils/env";
import dotenv from "dotenv";

dotenv.config();

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

  public async check() {}

  /**
   *
   * @description This function is contain private api to get token data.
   * In the private data, there is a related token and related x account handle.
   */
  public async getTokenData() {
    try {
      const url = getEnv("PRIVATE_SERVER_API_URL");
      const apiKey = getEnv("PRIVATE_SERVER_API_KEY");

      const response = await axios.get(`${url}/data/${this.address}`, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      });

      return response.data;
    } catch (error) {
      console.log(error);
      logger.error("Failed to get token data", error);
      throw new Error("Failed to get token data");
    }
  }
}
