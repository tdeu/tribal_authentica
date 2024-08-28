// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Authentification is ERC721, ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;
    uint256 public submissionCount;

    struct MaskSubmission {
        address submitter;
        string ipfsHash;
        uint8 approvalCount;
        uint8 rejectionCount;
        bool isAuthenticated;
        bool isCompleted;
        mapping(address => bool) hasValidated;
    }

    mapping(uint256 => MaskSubmission) public submissions;

    event MaskSubmitted(uint256 indexed submissionId, address indexed submitter, string ipfsHash);
    event MaskValidated(uint256 indexed submissionId, address indexed validator, bool approved);
    event AuthenticationComplete(uint256 indexed submissionId, bool authenticated);

    constructor(address initialOwner) ERC721("Authentification", "TANFT") Ownable(initialOwner) {}

    function submitMask(string memory ipfsHash) public {
        uint256 submissionId = submissionCount++;
        MaskSubmission storage newSubmission = submissions[submissionId];
        newSubmission.submitter = msg.sender;
        newSubmission.ipfsHash = ipfsHash;
        newSubmission.isCompleted = false;
        newSubmission.isAuthenticated = false;

        emit MaskSubmitted(submissionId, msg.sender, ipfsHash);
    }

    function validateMask(uint256 submissionId, bool approved) public {
        MaskSubmission storage submission = submissions[submissionId];
        require(!submission.isCompleted, "Validation process completed.");
        require(!submission.hasValidated[msg.sender], "Validator has already voted.");

        submission.hasValidated[msg.sender] = true;

        if (approved) {
            submission.approvalCount++;
        } else {
            submission.rejectionCount++;
        }

        emit MaskValidated(submissionId, msg.sender, approved);

        uint8 totalVotes = submission.approvalCount + submission.rejectionCount;
        if (totalVotes >= 17) { // Assuming we need at least 17 votes
            submission.isCompleted = true;
            submission.isAuthenticated = (submission.approvalCount >= 13); // 75% of 17 is ~13

            if (submission.isAuthenticated) {
                _mintAuthenticatedMask(submission.submitter, submissionId);
            }

            emit AuthenticationComplete(submissionId, submission.isAuthenticated);
        }
    }

    function _mintAuthenticatedMask(address to, uint256 submissionId) internal {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, submissions[submissionId].ipfsHash);
    }

    // Override functions
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
