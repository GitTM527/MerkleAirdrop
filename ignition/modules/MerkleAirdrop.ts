import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const tokenAddress = ""

const MerkleAirdropModule = buildModule("MerkleAirdropModule", (m) => {


  const save = m.contract("MerkleAirdrop", [tokenAddress]);

  return { save };
});

export default MerkleAirdropModule;