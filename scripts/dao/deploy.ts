import { ethers, network } from "hardhat";
import {Address} from "../../app/address"

async function main() {
  let address = new Address(network.name);

  const minQuorum = ethers.utils.parseEther("10.0");
  const minPeriod = 3 * 24 * 60 * 60;
  const Dao = await ethers.getContractFactory("Dao");
  const dao = await Dao.deploy(address.USER, minQuorum, minPeriod, address.STAKING);
  await dao.deployed();

  console.log("dao deployed to:", dao.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
