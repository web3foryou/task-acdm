import { ethers } from "hardhat";

async function main() {
  const name = "XXX Coin";
  const symbol = "XXX";
  let mintBalance = ethers.utils.parseEther("10000000.0");
  let decimals = 18;

  const xxxFactory = await ethers.getContractFactory("XXXToken");
  const xxx = await xxxFactory.deploy(name, symbol, mintBalance, decimals);

  await xxx.deployed();

  console.log("XXX deployed to:", xxx.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
