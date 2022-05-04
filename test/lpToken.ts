import { expect } from "chai";
import { ethers } from "hardhat";

describe("LpToken", function () {
  it("Deploy", async function () {

    const [user, user2, user3] = await ethers.getSigners();

    const lpFactory = await ethers.getContractFactory("LpToken");

    const name = "LP Token";
    const symbol = "LP";
    let decimals = 18;
    let mintBalance = ethers.utils.parseEther("1000000.0");

    const lp = await lpFactory.deploy(name, symbol, mintBalance, decimals);

    expect(await lp.name()).to.equal(name);
    expect(await lp.symbol()).to.equal(symbol);
    expect(await lp.balanceOf(user.address)).to.equal(mintBalance);
  });
});
