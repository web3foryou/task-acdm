import { expect } from "chai";
import { ethers } from "hardhat";

describe("AcdmToken", function () {
  it("Deploy", async function () {
    const [user, user2, user3] = await ethers.getSigners();

    const name = "ACADEM Coin";
    const symbol = "ACDM";
    let decimals = 6;
    let mintBalance = 10 * 1000 * 1000 * 10 ** 6;

    const acdmFactory = await ethers.getContractFactory("ACDMToken");

    const acdm = await acdmFactory.deploy(name, symbol, mintBalance, decimals);

    expect(await acdm.name()).to.equal(name);
    expect(await acdm.symbol()).to.equal(symbol);
    expect(await acdm.balanceOf(user.address)).to.equal(mintBalance);
  });
});
