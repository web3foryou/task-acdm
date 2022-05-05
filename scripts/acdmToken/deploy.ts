import { ethers, network } from "hardhat";

async function main() {
  const name = "ACADEM Coin";
  const symbol = "ACDM";
  let decimals = 6;
  let mintBalance = 10 * 1000 * 1000 * 10 ** 6;

  const acdmFactory = await ethers.getContractFactory("ACDMToken");

  const acdm = await acdmFactory.deploy(name, symbol, mintBalance, decimals);
  await acdm.deployed();

  console.log("acdm deployed to:", acdm.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
