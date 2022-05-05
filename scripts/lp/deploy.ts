import { ethers } from "hardhat";

async function main() {
  const name = "LpToken";
  const symbol = "LP";
  let mintBalance = ethers.utils.parseEther("10000000.0");
  let decimals = 18;

  const lpFactory = await ethers.getContractFactory("LpToken");
  const lp = await lpFactory.deploy(name, symbol, mintBalance, decimals);

  await lp.deployed();

  console.log("LP deployed to:", lp.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
