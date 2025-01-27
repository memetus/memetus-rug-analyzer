import dotenv from "dotenv";
import { MemetusRugAgent } from "@/src/model/memetus/agent";
import { MemetusRugChecker, ProjectType } from "@/src/model/memetus";
import { DataProvider } from "@/src/model/memetus/provider";
import { AIMessage } from "@langchain/core/messages";
import { CheckData } from "@/src/types/provider";
import {
  BLUE,
  GREEN,
  RED,
  RESET,
  startLoadingAnimation,
  YELLOW,
} from "@/src/cli";
import { exit } from "process";
import { SOLANA_ADDRESS_REGEX } from "@/src/constant/address";
import { executeWriteAsync } from "@/src/utils/io";
import { HolderChecker } from "@/src/model/holderChecker";
import { createConnection } from "@/src/config/chain";
import { LiquidityChecker } from "@/src/model/liquidityChecker";
import { MarketChecker } from "@/src/model/marketChecker";
import { MetadataChecker } from "@/src/model/metadataChecker";
import { WebsiteChecker } from "@/src/model/websiteChecker";
import { CommunityChecker } from "@/src/model/communityChecker";

dotenv.config();

const fetchData = async (address: string) => {
  const stopAnimation = startLoadingAnimation(
    "Fetching data to check rug...",
    `${GREEN}\nFetching data completed!\n\n`
  );
  try {
    const memetusDataProvider = new DataProvider(address);
    const data: CheckData = await memetusDataProvider.setData();

    return data;
  } catch (error) {
    console.log(
      `${YELLOW}An issue has occurred. Please check the error details below:\n`
    );
    console.log(error);
  } finally {
    stopAnimation();
  }
};

const calculateData = async (data: CheckData, projectType: ProjectType) => {
  const stopAnimation = startLoadingAnimation("Calculating giveng data...\n\n");

  try {
    const memetusRugChecker = new MemetusRugChecker(data, projectType);

    const score = memetusRugChecker.getScore();
    console.log(
      `${
        score >= 50 ? GREEN : score < 50 && score > -50 ? YELLOW : RED
      }\nScore: ${score}`
    );
  } catch (error) {
    console.log(
      `${YELLOW}An issue has occurred. Please check the error details below:\n`
    );
    console.log(error);
  } finally {
    stopAnimation();
  }
};

const handleCheck = async (argv: string[]) => {
  try {
    console.log(`${BLUE}Starting a rug check for the given token...\n\n`);
    console.log(`${RESET}Address: ${argv[0]}\n`);

    const data = await fetchData(argv[0]);

    if (!data) {
      exit(1);
    }

    console.log(`${RESET}Name: ${data.tokenName}`);
    console.log(`${RESET}Symbol: ${data.tokenSymbol}`);
    console.log(`${RESET}Total Supply: ${data.totalSupply}`);
    console.log(`${RESET}Creator Address: ${data.creatorAddress}\n`);

    const urls = data.urls.map((url) => url.url);

    if (urls.length === 0) {
      calculateData(data, undefined);
    } else {
      console.log(
        `${BLUE}Assigning weights based on the token's category...\n`
      );
      const memetusRugAgent = await MemetusRugAgent.init();
      const runnable = memetusRugAgent.compile();
      const result = await runnable.invoke({
        messages: [...urls],
      });

      let projectType = undefined;

      if (result && result.messages) {
        const aiMessage = result.messages[result.messages.length - 1];
        if (aiMessage instanceof AIMessage) {
          projectType = aiMessage.content.toString().includes("undefined")
            ? undefined
            : (aiMessage.content as ProjectType);
        }
      }
      calculateData(data, projectType);
    }
    if ((argv.length > 2 && argv[1] === "--gen") || argv[1] === "-g") {
      executeWriteAsync(`${argv[0]}.json`, JSON.stringify(data));
    }
  } catch (error) {
    console.log(
      `${YELLOW}Unexpected error has occurred. Please check the error details below:\n`
    );
    console.error(error);
  }
};

const handleHolder = async (address: string) => {
  const connection = createConnection();
  console.log(`${BLUE}Starting a holder check for the given token...\n\n`);
  const stopAnimation = startLoadingAnimation(
    "Fetching data to check holder...",
    `${GREEN}\nFetching data completed!\n`
  );
  try {
    const holderChecker = new HolderChecker(address, connection);
    const score = await holderChecker.check();
    return score;
  } catch (error) {
    console.log(
      `${YELLOW}An issue has occurred. Please check the error details below:\n`
    );
  } finally {
    stopAnimation();
  }
};

const handleLiquidity = async (address: string) => {
  const connection = createConnection();
  console.log(`${BLUE}Starting a liquidity check for the given token...\n\n`);

  const stopAnimation = startLoadingAnimation(
    "Fetching data to check liquidity...",
    `${GREEN}\nFetching data completed!\n\n`
  );
  try {
    const liquidityChecker = new LiquidityChecker(address, connection);
    const score = await liquidityChecker.check();

    return score;
  } catch (error) {
    console.log(
      `${YELLOW}An issue has occurred. Please check the error details below:\n`
    );
  } finally {
    stopAnimation();
  }
};

const handleMarket = async (address: string) => {
  const connection = createConnection();
  console.log(`${BLUE}Starting a market check for the given token...\n\n`);

  const stopAnimation = startLoadingAnimation(
    "Fetching data to check market...",
    `${GREEN}\nFetching data completed!\n\n`
  );
  try {
    const marketChecker = new MarketChecker(address, connection);
    const score = await marketChecker.check();

    return score;
  } catch (error) {
    console.log(
      `${YELLOW}An issue has occurred. Please check the error details below:\n`
    );
  } finally {
    stopAnimation();
  }
};

const handleMetadata = async (address: string) => {
  const connection = createConnection();
  console.log(`${BLUE}Starting a metadata check for the given token...\n\n`);

  const stopAnimation = startLoadingAnimation(
    "Fetching data to check metadata...",
    `${GREEN}\nFetching data completed!\n\n`
  );
  try {
    const metadataChecker = new MetadataChecker(address, connection);
    const score = await metadataChecker.check();

    return score;
  } catch (error) {
    console.log(
      `${YELLOW}An issue has occurred. Please check the error details below:\n`
    );
  } finally {
    stopAnimation();
  }
};

const handleWebsite = async (address: string) => {
  console.log(`${BLUE}Starting a website check for the given token...\n\n`);

  const stopAnimation = startLoadingAnimation(
    "Fetching data to check website...",
    `${GREEN}\nFetching data completed!\n\n`
  );
  try {
    const websiteChecker = new WebsiteChecker(address);
    const score = await websiteChecker.check();

    return score;
  } catch (error) {
    console.log(
      `${YELLOW}An issue has occurred. Please check the error details below:\n`
    );
  } finally {
    stopAnimation();
  }
};

const handleCommunity = async (address: string) => {
  console.log(`${BLUE}Starting a community check for the given token...\n\n`);

  const stopAnimation = startLoadingAnimation(
    "Fetching data to check community...",
    `${GREEN}\nFetching data completed!\n\n`
  );
  try {
    const communityChecker = new CommunityChecker(address);
    const score = await communityChecker.check();

    return score;
  } catch (error) {
    console.log(
      `${YELLOW}An issue has occurred. Please check the error details below:\n`
    );
  } finally {
    stopAnimation();
  }
};

const handleSingleCheck = async (argv: string[]) => {
  if (argv[1] === "--holder" || argv[1] === "-h") {
    const score = await handleHolder(argv[0]);
    if (score !== undefined) {
      console.log(
        `${
          score >= 50 ? GREEN : score < 50 && score > -50 ? YELLOW : RED
        }\nScore: ${score}`
      );
    }
  } else if (argv[1] === "--liquidity" || argv[1] === "-l") {
    const score = await handleLiquidity(argv[0]);
    if (score !== undefined) {
      console.log(
        `${
          score >= 50 ? GREEN : score < 50 && score > -50 ? YELLOW : RED
        }\nScore: ${score}`
      );
    }
  } else if (argv[1] === "--market" || argv[1] === "-m") {
    const score = await handleMarket(argv[0]);
    if (score !== undefined) {
      console.log(
        `${
          score >= 50 ? GREEN : score < 50 && score > -50 ? YELLOW : RED
        }\nScore: ${score}`
      );
    }
  } else if (argv[1] === "--metadata" || argv[1] === "-md") {
    const score = await handleMetadata(argv[0]);
    if (score !== undefined) {
      console.log(
        `${
          score >= 50 ? GREEN : score < 50 && score > -50 ? YELLOW : RED
        }\nScore: ${score}`
      );
    }
  } else if (argv[1] === "--website" || argv[1] === "-w") {
    const score = await handleWebsite(argv[0]);
    if (score !== undefined) {
      console.log(
        `${
          score >= 50 ? GREEN : score < 50 && score > -50 ? YELLOW : RED
        }\nScore: ${score}`
      );
    }
  } else if (argv[1] === "--community" || argv[1] === "-c") {
    const score = await handleCommunity(argv[0]);
    if (score !== undefined) {
      console.log(
        `${
          score >= 50 ? GREEN : score < 50 && score > -50 ? YELLOW : RED
        }\nScore: ${score}`
      );
    }
  } else {
    console.log(
      `${YELLOW}Invalid argument. Please check the argument details below:\n`
    );
  }
};

const main = async (argv: string[]) => {
  if (argv.length === 1) {
    if (SOLANA_ADDRESS_REGEX.test(argv[0])) {
      handleCheck(argv);
    } else {
      console.log(`${YELLOW}Execution failed. Invalid address.\n`);
    }
  } else if (argv.length <= 2) {
    if (SOLANA_ADDRESS_REGEX.test(argv[0])) {
      if (argv[1] === "-g" || argv[1] === "--gen") {
        handleCheck(argv);
      } else {
        handleSingleCheck(argv);
      }
    } else if (SOLANA_ADDRESS_REGEX.test(argv[1])) {
      if (argv[0] === "-g" || argv[0] === "--gen") {
        handleCheck([argv[1], argv[0]]);
      } else {
        handleSingleCheck([argv[1], argv[0]]);
      }
    }
  } else {
    console.log(`${YELLOW}Execution failed. Invalid arguments count.\n`);
  }
};

main(process.argv.slice(2));
