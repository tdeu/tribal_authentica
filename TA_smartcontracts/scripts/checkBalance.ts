import { viem } from "hardhat";
import { formatEther } from 'viem'

async function main() {
  const [account] = await viem.getWalletClients();
  const publicClient = await viem.getPublicClient();

  const balance = await publicClient.getBalance({ address: account.account.address });
  
  console.log(`Address: ${account.account.address}`);
  console.log(`Balance: ${formatEther(balance)} ETH`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });