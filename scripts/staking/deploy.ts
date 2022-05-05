import { ethers } from "hardhat";
import {Address} from "../../app/address"

async function main() {
  let addresses = new Address(process.env.NETWORK as string);

  const nameStaking = "Staking";
  const stakingFactory = await ethers.getContractFactory("Staking");
  const staking = await stakingFactory.deploy(nameStaking, addresses.LP, addresses.XXX);
  await staking.deployed();

  console.log("staking deployed to:", staking.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
