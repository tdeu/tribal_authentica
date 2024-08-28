import { HardhatUserConfig, task } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";
import * as dotenv from "dotenv";

dotenv.config();

const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

if (!SEPOLIA_RPC_URL) {
  console.error("Please set your SEPOLIA_RPC_URL in a .env file");
  process.exit(1);
}

if (!PRIVATE_KEY) {
  console.error("Please set your PRIVATE_KEY in a .env file");
  process.exit(1);
}

console.log("Sepolia RPC URL:", SEPOLIA_RPC_URL.substring(0, 20) + "...");
console.log("Private Key defined:", !!PRIVATE_KEY);

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    sepolia: {
      url: SEPOLIA_RPC_URL,
      accounts: [PRIVATE_KEY],
    },
  },
};

// Only add Etherscan config if API key is provided
if (process.env.ETHERSCAN_API_KEY) {
  config.etherscan = {
    apiKey: process.env.ETHERSCAN_API_KEY,
  };
  console.log("Etherscan API Key defined: Yes");
} else {
  console.log("Etherscan API Key defined: No (only needed for contract verification)");
}

export default config;

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.viem.getWalletClients();
  for (const account of accounts) {
    console.log(account.account.address);
  }
});