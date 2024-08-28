import { viem } from "hardhat";

async function main() {
  const [owner] = await viem.getWalletClients();
  
  const contractAddress = "0x67e33d6ab1a6305857adaf6cd0461f8254ab2c2b";
  const contract = await viem.getContractAt("TribalAuthenticaNFT", contractAddress);

  // Test submitMask function
  const ipfsHash = "QmTest123";
  await contract.write.submitMask([ipfsHash]);
  console.log("Mask submitted with IPFS hash:", ipfsHash);

  // Test voteOnSubmission function
  const submissionId = 0n;
  const votes = [true, true, true, true, true, true, true, true, false, false];
  await contract.write.voteOnSubmission([submissionId, votes]);
  console.log("Voted on submission:", submissionId);

  // Get submission details
  const submission = await contract.read.submissions([submissionId]);
  console.log("Submission details:", submission);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });