import { expect } from "chai";
import { viem } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

describe("TribalAuthenticaNFT", function () {
  async function deployTribalAuthenticaNFTFixture() {
    const [owner, addr1, addr2, ...otherAccounts] = await viem.getWalletClients();
    
    const tribalAuthenticaNFT = await viem.deployContract("TribalAuthenticaNFT", [owner.account.address]);
    
    return { tribalAuthenticaNFT, owner, addr1, addr2, otherAccounts };
  }

  describe("Mask Validation", function () {
    it("Should allow a validator to vote on a submission", async function () {
      const { tribalAuthenticaNFT, addr1, otherAccounts } = await loadFixture(deployTribalAuthenticaNFTFixture);
      const ipfsHash = "QmTestHash";
    
      await tribalAuthenticaNFT.write.submitMask([ipfsHash], { account: addr1.account });
    
      await tribalAuthenticaNFT.write.validateMask([0n, true], { account: otherAccounts[0].account });
    
      const submission = await tribalAuthenticaNFT.read.submissions([0n]);
      expect(submission[2].toString()).to.equal('1', "Approval count should be 1");
    });

    it("Should not allow a validator to vote twice on the same submission", async function () {
      const { tribalAuthenticaNFT, addr1, otherAccounts } = await loadFixture(deployTribalAuthenticaNFTFixture);
      const ipfsHash = "QmTestHash";

      await tribalAuthenticaNFT.write.submitMask([ipfsHash], { account: addr1.account });
      await tribalAuthenticaNFT.write.validateMask([0n, true], { account: otherAccounts[0].account });

      await expect(
        tribalAuthenticaNFT.write.validateMask([0n, true], { account: otherAccounts[0].account })
      ).to.be.rejectedWith("Validator has already voted");
    });

    it("Should complete authentication after all available votes", async function () {
      const { tribalAuthenticaNFT, addr1, otherAccounts } = await loadFixture(deployTribalAuthenticaNFTFixture);
      const ipfsHash = "QmTestHash";

      await tribalAuthenticaNFT.write.submitMask([ipfsHash], { account: addr1.account });

      // Cast 13 approval votes and 4 rejection votes
      for (let i = 0; i < 13; i++) {
        await tribalAuthenticaNFT.write.validateMask([0n, true], { account: otherAccounts[i].account });
      }
      for (let i = 13; i < 17; i++) {
        await tribalAuthenticaNFT.write.validateMask([0n, false], { account: otherAccounts[i].account });
      }

      const submission = await tribalAuthenticaNFT.read.submissions([0n]);
      expect(submission[4]).to.be.true; // isAuthenticated
      expect(submission[5]).to.be.true; // isCompleted
    });

    it("Should fail authentication if less than required approvals", async function () {
      const { tribalAuthenticaNFT, addr1, otherAccounts } = await loadFixture(deployTribalAuthenticaNFTFixture);
      const ipfsHash = "QmTestHash";

      await tribalAuthenticaNFT.write.submitMask([ipfsHash], { account: addr1.account });

      // Cast 12 approval votes and 5 rejection votes
      for (let i = 0; i < 12; i++) {
        await tribalAuthenticaNFT.write.validateMask([0n, true], { account: otherAccounts[i].account });
      }
      for (let i = 12; i < 17; i++) {
        await tribalAuthenticaNFT.write.validateMask([0n, false], { account: otherAccounts[i].account });
      }

      const submission = await tribalAuthenticaNFT.read.submissions([0n]);
      expect(submission[4]).to.be.false; // isAuthenticated
      expect(submission[5]).to.be.true; // isCompleted
    });
  });
});