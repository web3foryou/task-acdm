import { ethers, network } from "hardhat";
import {Address} from "../../app/address"

async function main() {
  let addresses = new Address(process.env.NETWORK as string);

  let roundTime = 24 * 60 * 60;
  const Platform = await ethers.getContractFactory("ACDMPlatform");
  const platform = await Platform.deploy(addresses.ACDM, roundTime);
  await platform.deployed();

  console.log("platform deployed to:", platform.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
