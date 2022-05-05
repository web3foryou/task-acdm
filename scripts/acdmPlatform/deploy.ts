import { ethers, network } from "hardhat";
import {Address} from "../../app/address"

async function main() {
  let address = new Address(network.name);

  let roundTime = 24 * 60 * 60;
  const Platform = await ethers.getContractFactory("ACDMPlatform");
  const platform = await Platform.deploy(address.ACDM, roundTime);
  await platform.deployed();

  console.log("platform deployed to:", platform.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
