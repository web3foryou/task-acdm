import { expect } from "chai";
import { ethers } from "hardhat";

describe("XxxToken", function () {
  it("Deploy", async function () {
    const [user, user2, user3] = await ethers.getSigners();

    const name = "XXX Coin";
    const symbol = "XXX";
    let decimals = 18;
    let mintBalance = ethers.utils.parseEther("1000000.0");

    const acdmFactory = await ethers.getContractFactory("XXXToken");

    const acdm = await acdmFactory.deploy(name, symbol, mintBalance, decimals);

    expect(await acdm.name()).to.equal(name);
    expect(await acdm.symbol()).to.equal(symbol);
    expect(await acdm.balanceOf(user.address)).to.equal(mintBalance);
  });
});
