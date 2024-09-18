// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// ============ Imports ============

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";   // IERC20 Interface from OZ
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol"; // OZ: MerkleProof
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title MerkleAirdrop
/// @notice ERC20 claimable by members of a merkle tree


contract MerkleAirdrop {

        IERC20 public token;
        address public owner;
        IERC721 public BAYCNFT;//IERC721("0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d");

  bytes32 public immutable merkleRoot;


  // Mapping of addresses who have claimed tokens
  mapping(address => bool) public hasClaimed;
  
  /// ============ Errors ============

  //Thrown if address has already claimed
  error AlreadyClaimed();
  //Thrown if address/amount are not part of Merkle tree
  error NotInMerkle();

  
  /// ============ Constructor ============

  constructor(
    address _token,
    bytes32 _merkleRoot,
    address _baycNft
   ) {
    token = IERC20(_token);
    BAYCNFT = IERC721(_baycNft);
    merkleRoot = _merkleRoot; // Update root\\\
    owner = msg.sender;
    
  }

  //Events to emit successful token claim
  event Claim(address indexed to, uint256 amount);

  //Functions to verify if claim has been made by token
  function claim(address to, uint256 amount, bytes32[] calldata proof) external {
    //Check if a user own the BAYCNFT
    if (BAYCNFT.balanceOf(to) == 0) revert NotInMerkle();
    // Throw if address has already claimed tokens
    if (hasClaimed[to]) revert AlreadyClaimed();

    // Verify merkle proof, or revert if not in tree
    bytes32 leaf = keccak256(abi.encodePacked(to, amount));
    bool isValidLeaf = MerkleProof.verify(proof, merkleRoot, leaf);
    if (!isValidLeaf) revert NotInMerkle();

    // Set address to claimed
    hasClaimed[to] = true;

    // Transfer tokens to address
    require(token.transfer(to, amount), "Transfer failed");

    // Emit claim event
    emit Claim(to, amount);
  }
}