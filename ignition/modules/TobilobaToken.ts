import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";


const TobilobaTokenModule = buildModule("TobilobaTokenModule", (m) => {


  const erc20 = m.contract("TobilobaToken");

  return { erc20 };
});

export default TobilobaTokenModule;