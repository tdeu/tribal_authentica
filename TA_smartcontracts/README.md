System Overview
- Validators: Initially, anyone connected to the network can participate as a validator.
- Reputation: A separate smart contract will handle reputation, allowing you to update and expand on it later without affecting the core validation contract.
- Decentralization: We'll maintain an open system where anyone can validate. In the future, you could add reputation-based weighting or other mechanisms to enhance trust and security.
- Gas Costs, Security, and Scalability: These are deferred for future consideration, but it’s important to design the system modularly to facilitate updates.
- Dispute Resolution: Masks that don’t meet the 8/10 validation threshold will be considered "fake" and can be resubmitted for another round of validation.
- Data Storage: Findings will be stored off-chain using IPFS, and the IPFS hash will be stored on-chain.
- Transparency: Validators and users can track the validation process and outcomes on-chain, using tools like Etherscan.
- Upgradeability: The contract will be designed with upgradeability in mind, allowing for future enhancements.

//////////////////////

Key Considerations
==> Validators and Decentralization:

Open Participation: Initially, anyone can validate, ensuring a wide pool of validators and encouraging participation.
Reputation Integration: Later, you can integrate reputation into a separate contract. Validators with higher reputation could have their votes weighted more heavily, or only validators above a certain reputation threshold could participate.

==> Data and Transparency:

IPFS Storage: Findings are stored off-chain using IPFS. The hash is stored on-chain, ensuring that the data remains immutable and decentralized.
On-Chain Tracking: Users can monitor the validation process on-chain using tools like Etherscan. The contract will update the status of submissions in real-time.
==> Upgradeability:

Modular Design: The contract is designed to be upgradeable, allowing you to add new features or improve existing logic without deploying an entirely new contract. The upgradeTo function enables this using the TransparentUpgradeableProxy pattern.

/////////////////
Next Steps
- Testing and Iteration: Deploy this contract on a testnet to simulate the validation process with real participants. This will help you identify any potential issues with gas costs, validator participation, or security.
- Reputation System: Begin developing the reputation smart contract, which can be integrated later to enhance the validation process.
- Security Considerations: As you progress, consider adding security measures to protect against Sybil attacks, fraudulent submissions, and manipulation of votes.
This structure should provide a solid foundation for your DApp, with the flexibility to evolve as your project grows.


Deployment on sepolia: 

npx hardhat run scripts/deploy.ts --network sepolia
Sepolia RPC URL: https://eth-sepolia....
Private Key defined: true
Etherscan API Key defined: No (only needed for contract verification)  
Sepolia RPC URL: https://eth-sepolia....
Private Key defined: true
Etherscan API Key defined: No (only needed for contract verification)  
Deploying contracts with the account: 0x819aa0524c99244493ed601b2da5a99996c522ae
authentification contract deployed to: 0xbcdd5cc1cd0fa804ae1ea14e05922a6222a5bc9f
PS C:\Users\thoma\Bureau\TA\TA_smartcontracts> 


0x89ff1309fDE3AaF0c1376ADF66E44BF31B869972 
 is the contract with the function to fetech the validator dashboard details
