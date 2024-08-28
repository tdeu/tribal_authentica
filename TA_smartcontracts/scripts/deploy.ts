import { createPublicClient, createWalletClient, http } from 'viem';
import { sepolia } from 'viem/chains';
import { readFileSync } from 'fs';
import path from 'path';

// Your private key and initial owner address
const privateKey = '4c5ddcd1087051463e90032dcb8e89dd274a4e249a14dda4d5e271e8adb9a3bc'; // Replace with your private key
const initialOwnerAddress = '0x647EeA6fEB854E4CD7453D45F63E105ae211E2aD'; // Replace with the initial owner address

async function main() {
  const walletClient = createWalletClient({
    account: privateKey,
    chain: sepolia,
    transport: http(),
  });

  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(),
  });

  // Load the contract artifact
  const artifactPath = path.join(__dirname, '../artifacts/contracts/Authentification.sol/Authentification.json');
  const contractArtifact = JSON.parse(readFileSync(artifactPath, 'utf8'));

  console.log('ABI:', contractArtifact.abi);
  console.log('Bytecode:', contractArtifact.bytecode);

  try {
    // Deploy the contract
    const tx = await walletClient.deployContract({
      abi: contractArtifact.abi,
      bytecode: contractArtifact.bytecode,
      args: [initialOwnerAddress], // Constructor arguments
    });

    // Wait for the transaction to be mined
    const receipt = await publicClient.waitForTransactionReceipt(tx.transactionHash);

    // Extract the contract address from the receipt
    const contractAddress = receipt.contractAddress;

    console.log('Authentification contract deployed to:', contractAddress);
    console.log('Deployment transaction receipt:', receipt);
  } catch (error) {
    console.error('Error during contract deployment:', error);
    throw error;
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
