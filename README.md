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
