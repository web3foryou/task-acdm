import { ethers, network } from "hardhat";
import {Address} from "../../app/address"

async function main() {
  const [signer] = await ethers.getSigners();

  let addresses = new Address(process.env.NETWORK as string);

  const minQuorum = ethers.utils.parseEther("10.0");
  const minPeriod = 3 * 24 * 60 * 60;
  const Dao = await ethers.getContractFactory("Dao");
  const dao = await Dao.deploy(signer.address, minQuorum, minPeriod, addresses.STAKING);
  await dao.deployed();

  console.log("dao deployed to:", dao.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
