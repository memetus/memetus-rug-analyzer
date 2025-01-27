## Homo Memetus Rug Analyzer Module

> This repository is part of the Homo-Memetus system and serves the purpose of analyzing the potential for rug pulls in memecoin launched in solana blockchain.

### Repository Description

> This project analyzes the on-chain data (holders, liquidity, market), metadata, social data, and GitHub data of memecoins in the Solana ecosystem (following the SPL standard) to assess the risk of the given memecoin. The return value ranges from -100 to 100, where values closer to -100 indicate higher risk and values closer to 100 indicate greater safety.

| Rug Score Range       | Status  |
| --------------------- | ------- |
| 50 and above          | Safe    |
| Below 50 to above -50 | Caution |
| -50 and below         | Risky   |

For the purpose of making this repository public, free APIs have been used whenever possible to allow other developers to test it.

The data collected and evaluated in this module represents the minimum required to avoid scam projects. The purpose of the module is not to identify projects with high returns but to help avoid scam projects. Please note that a high score does not guarantee high returns.

### Checking Data

```bash
./src/types/provider.d.ts
```

#### Holder Data

```bash
./src/model/holderChecker.ts
```

| Data Field        | Desctiption                                                                                 |
| ----------------- | ------------------------------------------------------------------------------------------- |
| totalHolder       | Total holder count of given token address.                                                  |
| topHolder         | Top 10, 20, 50 (maximum) holders' addresses, balances, and percentages list of given token. |
| top10Validation   | Top 10 holders own other tokens or only hold of given token.                                |
| creatorPercentage | The percentage of the token creator. If locked, it includes the locked amount.              |

#### Liquidity Data

```bash
./src/model/liquidityChecker.ts
```

| Data Field          | Desctiption                                                      |
| ------------------- | ---------------------------------------------------------------- |
| totalLiquidity      | Total liquidity size of given token.                             |
| liquidityRatio      | The ratio of total liquidity to total market cap of given token. |
| totalLpCount        | The total number of liquidity pool of given token.               |
| largestLp           | The largest LP among the various LPs for the given token.        |
| largestLpPercentage | The proportion of the largest LP for the given token.            |

#### Github Data

```bash
./src/model/githubChecker.ts
```

| Data Field      | Desctiption                                          |
| --------------- | ---------------------------------------------------- |
| githubList      | The number of GitHub links related with given token. |
| stargazersCount | The number of stars on the repository.               |
| watchersCount   | The number of watchers on the repository.            |
| forkCount       | The number of forks on the repository.               |
| openIssueCount  | The number of open issue count on the repository.    |
| hasWiki         | Whether the repository has a wiki.                   |
| hasPages        | Whether the repository has a pages.                  |
| hasProjects     | Whether the repository has a project.                |
| hasDiscussions  | Whether the repository has a discussion.             |
| hasIssues       | Whether the repository has a issues.                 |
| hasDownloads    | Whether the repository has a download.               |
| visibility      | The visibility of the repository                     |

#### Community Data

```bash
./src/model/communityChecker.ts
```

| Data Field      | Desctiption                                          |
| --------------- | ---------------------------------------------------- |
| githubList      | The number of GitHub links related with given token. |
| stargazersCount | The number of stars on the repository.               |
| watchersCount   | The number of watchers on the repository.            |
| forkCount       | The number of forks on the repository.               |
| openIssueCount  | The number of open issue count on the repository.    |
| hasWiki         | Whether the repository has a wiki.                   |
| hasPages        | Whether the repository has a pages.                  |
| hasProjects     | Whether the repository has a project.                |
| hasDiscussions  | Whether the repository has a discussion.             |
| hasIssues       | Whether the repository has a issues.                 |
| hasDownloads    | Whether the repository has a download.               |
| visibility      | The visibility of the repository                     |

#### Project Metadata

```bash
./src/model/metadataChecker.ts
```

| Data Field       | Desctiption                                                                                                      |
| ---------------- | ---------------------------------------------------------------------------------------------------------------- |
| creatorAddress   | The wallet account that create a given token.                                                                    |
| creatorSignature | The signature used when creating the given token.                                                                |
| creatorBalance   | The balance of the token creator. If locked, it includes the locked amount.                                      |
| creatorLocked    | The information about the token lock by the creator, including the addresses of locked tokens and their amounts. |
| creatorTransfer  | The information about the token transfered by the creator, it includes send and receive both.                    |
| creatorSold      | The information about the token sold count by the creator                                                        |
| mintability      | The information on whether the creator can mint additional tokens.                                               |
| mutability       | The information on whether the token data can be modified.                                                       |
| freezability     | The information on whether token transactions can be frozen.                                                     |

#### Website Data

```bash
./src/model/websiteChecker.ts
```

| Data Field  | Desctiption                                           |
| ----------- | ----------------------------------------------------- |
| totalUrl    | The number of website links related with given token. |
| label       | The type of url it include documents or websites.     |
| ip          | The IP address hosting the url.                       |
| city        | The city name corresponding to the IP address.        |
| region      | The region corresponding to the IP address.           |
| country     | The country corresponding to the IP address.          |
| location    | The location corresponding to the IP address.         |
| postal      | The postal code corresponding to the IP address.      |
| timezone    | The timezone corresponding to the IP address.         |
| name        | The name of metadata about given link.                |
| description | The description of metadata about given link.         |
| keywords    | The keywords of metadata about given link.            |
| autor       | The autor of metadata about given link.               |

### Directory Structure

```text
.
├── smaple/ # These are the results of executing this module. Rug checks are conducted based on this data.
├── src / # application source code
│ ├── cli / # This is the CLI-related code for running this project.
│ ├── config / # This is the code for some configurations related to the project.
| ├── constant / # This is the code defining some constants used in the project.
| ├── data / # This is the code defining the data classes used in the project.
| ├── lib / # This is the code defining the library used in the project.
| ├── model / # This is the code defined core checker class in the project.
| ├── module / # This is the code defined module class in the project.
| ├── types / # This is the code defined types in the project.
| └── utils / # This is the code defined utility function in the project.
├── test / # test directoty.
└── package.json # application dependencies
```

### Environment Setting

```text
HELIUS_API_KEY="<Your Helius API KEY>"
IPINFO_API_KEY="<Your IpInfo API KEY>"
TWITTER_BEARER_TOKEN="<Your Twitter Bearer Token>"
MODEL_ID="<gpt-4o>" # Our finetuned rug checker agent is private
TAVILY_API_KEY="<Your Tavily API KEY>"
OPENAI_API_KEY="<Your OpenAI API KEY>"
GITHUB_BEARER_TOKEN="<Your Github Bearer Token>"
```

### Usage

You can run the project using the following command:

#### basic execution

```bash
bash ./run.sh <TOKEN_ADDRESS>
```

#### executtion with generate <address>.json file

```bash
bash ./run.sh <TOKEN_ADDRESS> --gen #or -g
```

#### execution single checker

##### holder

```bash
bash ./run.sh <TOKEN_ADDRESS> --holder #or -h
```

##### liquidity

```bash
bash ./run.sh <TOKEN_ADDRESS> --liquidity #or -l
```

##### community

```bash
bash ./run.sh <TOKEN_ADDRESS> --community #or -c
```

##### metadata

```bash
bash ./run.sh <TOKEN_ADDRESS> --metadata #or -md
```

##### market

```bash
bash ./run.sh <TOKEN_ADDRESS> --market #or -m
```

##### website

```bash
bash ./run.sh <TOKEN_ADDRESS> --website #or -w
```

### Notification

1. Tokens that are either outdated or newly generated may not function properly.
2. This repository is designed to provide data using free APIs available for public use. There may be slight differences compared to the checkers used in our system.
3. If you have any bugs or suggestions, please leave an issue.
