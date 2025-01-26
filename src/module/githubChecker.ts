import axios from "axios";
import { getEnv } from "@/src/utils/env";
import { logger } from "../config/log";
import { GithubShape } from "../types/githubShape";

interface IGithubChecker {}

export class GithubChecker implements IGithubChecker {
  constructor() {}

  public async getEvaluationData(repositoryUrl: string) {
    try {
      const data = await this.getRepositoryData(repositoryUrl);

      if (!data) {
        logger.error("Failed to get repository data");
        throw new Error("Failed to get repository data");
      }

      const returnData: GithubShape = {
        name: data.name,
        url: repositoryUrl,
        description: data.description,
        private: data.private,
        isFork: data.fork,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        size: data.size,
        stargazersCount: data.stargazers_count,
        watchersCount: data.watchers_count,
        hasIssues: data.has_issues,
        hasProjects: data.has_projects,
        hasDownloads: data.has_downloads,
        hasWiki: data.has_wiki,
        hasPages: data.has_pages,
        hasDiscussions: data.has_discussions,
        openIssueCount: data.open_issues_count,
        visibility: data.visibility,
        forkCount: data.forks,
      };

      return returnData;
    } catch (error) {
      logger.error("Failed to get repository data", error);
      throw new Error("Failed to get repository data");
    }
  }

  public async getRepositoryData(repositoryUrl: string) {
    try {
      const bearerToken = getEnv("GITHUB_BEARER_TOKEN");
      const url = this.setApiUrlFormat(repositoryUrl);
      const res = await axios.get(`${url}`, {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
      });

      return res.data;
    } catch (error) {
      console.log(error);
      logger.error("Failed to get repository data", error);
      throw new Error("Failed to get repository data");
    }
  }

  public setApiUrlFormat(repositoryUrl: string) {
    try {
      const url = repositoryUrl.split("github.com/")[1];
      return `https://api.github.com/repos/${url}`;
    } catch (error) {
      console.log(error);
      logger.error("Failed to set api url format", error);
      throw new Error("Failed to set api url format");
    }
  }
}
