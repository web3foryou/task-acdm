import { ethers } from "hardhat";
import {network} from 'hardhat'
import {Address} from "../../app/address"

async function main() {
  let address = new Address(network.name);

  const nameStaking = "Staking";
  const stakingFactory = await ethers.getContractFactory("Staking");
  const staking = await stakingFactory.deploy(nameStaking, address.LP, address.XXX);
  await staking.deployed();

  console.log("staking deployed to:", staking.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
