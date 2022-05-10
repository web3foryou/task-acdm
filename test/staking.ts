import { expect } from "chai";
import { ethers } from "hardhat";

describe("Staking", function () {
  async function deploy() : Promise<any> {
    const [user, user2, user3] = await ethers.getSigners();

    const nameLp = "LP Token";
    const symbolLp = "LP";
    const lpFactory = await ethers.getContractFactory("LpToken");
    let mintBalanceLp = ethers.utils.parseEther("1000000.0");
    const lp = await lpFactory.deploy(nameLp, symbolLp, mintBalanceLp, 18);
    await lp.deployed();

    const nameXXX = "XXX Coin";
    const symbolXXX = "XXX";
    let mintBalanceXXX = ethers.utils.parseEther("0.0");
    let decimalsXXX = 18;
    const xxxFactory = await ethers.getContractFactory("XXXToken");
    const xxx = await xxxFactory.deploy(nameXXX, symbolXXX, mintBalanceXXX, decimalsXXX);
    await xxx.deployed();

    const nameStaking = "Staking";
    const stakingFactory = await ethers.getContractFactory("Staking");
    const staking = await stakingFactory.deploy(nameStaking, lp.address, xxx.address);
    await staking.deployed();

    const minQuorum = ethers.utils.parseEther("10.0");
    const minPeriod = 3 * 24 * 60 * 60;
    const Dao = await ethers.getContractFactory("Dao");
    const dao = await Dao.deploy(user.address, minQuorum, minPeriod, staking.address);
    await dao.deployed();

    await staking.addMember(dao.address);
    await staking.setDao(dao.address);

    return [lp, xxx, staking, dao];
  }

  it("name, stake, balanceOf, unstake, claim", async function () {
    const [user, user2, user3] = await ethers.getSigners();
    const [lp, xxx, staking] = await deploy();
    const nameStaking = "Staking";

    expect(await staking.name()).to.equal(nameStaking);

    let stakingAmount = ethers.utils.parseEther("1.0");
    const prcReward = 3;
    await lp.approve(staking.address, stakingAmount);
    await staking.stake(stakingAmount);
    expect(await staking.balanceOf(user.address)).to.equal(stakingAmount);
    expect(await lp.balanceOf(staking.address)).to.equal(stakingAmount);

    await expect(staking.unstake()).to.be.revertedWith('Time error.');

    let lockTime = 3 * 24 * 60 * 60;

    await ethers.provider.send("evm_increaseTime", [lockTime]);
    await ethers.provider.send("evm_mine", []);

    await staking.unstake();
    expect(await staking.balanceOf(user.address)).to.equal(0);
    expect(await lp.balanceOf(staking.address)).to.equal(0);
    await expect(staking.unstake()).to.be.revertedWith('No amount unstake');

    let stakingAmountBad = ethers.utils.parseEther("1.1");
    await lp.approve(staking.address, stakingAmount);
    await expect(staking.stake(stakingAmountBad)).to.be.revertedWith('No amount stake');
  });

  it("claim", async function () {
    const [user, user2, user3] = await ethers.getSigners();
    const [lp, xxx, staking] = await deploy();

    let stakingAmount = ethers.utils.parseEther("1.0");
    let rewardsAmount = ethers.utils.parseEther("1000.0");
    const prcReward = 3;
    let rewardTime = 24 * 60 * 60;

    // вывод без баланса
    await expect(staking.claim()).to.be.revertedWith('Zero balance.');

    await lp.approve(staking.address, stakingAmount);
    await staking.stake(stakingAmount);
    await xxx.mint(staking.address, rewardsAmount);

    // вывод через половину времени
    await ethers.provider.send("evm_increaseTime", [rewardTime / 2]);
    await ethers.provider.send("evm_mine", []);
    // вывод через половину времени
    await expect(staking.claim()).to.be.revertedWith('Time error.');

    // вывод через один период ревардов
    await ethers.provider.send("evm_increaseTime", [rewardTime / 2]);
    await ethers.provider.send("evm_mine", []);
    await staking.claim();
    let totalRewards = ethers.BigNumber.from((Number(stakingAmount) * prcReward / 100).toString());
    expect(await xxx.balanceOf(user.address)).to.equal(totalRewards);

    // вывод через +2 периода ревардов
    await ethers.provider.send("evm_increaseTime", [rewardTime * 2]);
    await ethers.provider.send("evm_mine", []);
    await staking.claim();
    totalRewards = ethers.BigNumber.from((3 * Number(stakingAmount) * prcReward / 100).toString());
    expect(await xxx.balanceOf(user.address)).to.equal(totalRewards);

    // вывод через +4 периода ревардов
    await ethers.provider.send("evm_increaseTime", [rewardTime * 4]);
    await ethers.provider.send("evm_mine", []);
    await staking.claim();
    totalRewards = ethers.BigNumber.from((7 * Number(stakingAmount) * prcReward / 100).toString());
    expect(await xxx.balanceOf(user.address)).to.equal(totalRewards);

  });

  it("changeTimeReward", async function () {
    const [, , staking] = await deploy();

    const timeRewardNew = 1000;

    await staking.changeTimeReward(timeRewardNew);
    expect(await staking.timeReward()).to.equal(timeRewardNew);
  });

  it("changePrcReward", async function () {
    const [user, user2, user3] = await ethers.getSigners();

    const [, , staking] = await deploy();

    const prcRewardNew = 10;

    await staking.changePrcReward(prcRewardNew);
    expect(await staking.prcReward()).to.equal(prcRewardNew);

    await expect(staking.connect(user2).changePrcReward(prcRewardNew)).to.be.revertedWith('Restricted to members.');
  });


  it("double stake", async function () {
    const [user, user2, user3] = await ethers.getSigners();
    const [lp, xxx, staking] = await deploy();

    let stakingAmount = ethers.utils.parseEther("1.0");
    let rewardsAmount = ethers.utils.parseEther("1000.0");
    const prcReward = 3;
    let rewardTime = 24 * 60 * 60;

    // вывод без баланса
    await expect(staking.claim()).to.be.revertedWith('Zero balance.');

    await lp.approve(staking.address, stakingAmount);
    await staking.stake(stakingAmount);
    await xxx.mint(staking.address, rewardsAmount);

    // второй стэйк после одного периода + вывод
    await ethers.provider.send("evm_increaseTime", [rewardTime]);
    await ethers.provider.send("evm_mine", []);
    await lp.approve(staking.address, stakingAmount);
    await staking.stake(stakingAmount);
    await ethers.provider.send("evm_increaseTime", [rewardTime]);
    await ethers.provider.send("evm_mine", []);
    await staking.claim();
    let totalRewards = ethers.BigNumber.from((3 * Number(stakingAmount) * prcReward / 100).toString());
    expect(await xxx.balanceOf(user.address)).to.equal(totalRewards);

    // ветка со дополнительным стейком без эмуляции времени
    await lp.approve(staking.address, stakingAmount);
    await staking.stake(stakingAmount);
    await lp.approve(staking.address, stakingAmount);
    await staking.stake(stakingAmount);
  });

  it("changeLockTime", async function () {
    const [lp, xxx, staking] = await deploy();

    let newLockTime = 24 * 60 * 60;

    await staking.changeLockTime(newLockTime);

    expect(await staking.lockTime()).to.equal(newLockTime);
  });

  it("Dao: You have an open vote", async function () {
    const [user, user2, user3] = await ethers.getSigners();
    const [lp, xxx, staking, dao] = await deploy();

    let stakingAmount = ethers.utils.parseEther("1.0");
    await lp.approve(staking.address, stakingAmount);
    await staking.stake(stakingAmount);

    let lockTime = 3 * 24 * 60 * 60;
    let lockTimeNew = 2 * 24 * 60 * 60;

    await ethers.provider.send("evm_increaseTime", [lockTime]);
    await ethers.provider.send("evm_mine", []);

    let callData = staking.interface.encodeFunctionData("changeLockTime", [lockTimeNew]);
    await dao.addProposal([callData], [staking.address], "changeLockTime")
    let lastProposal = await dao.lastProposal();
    await dao.vote(lastProposal, true);

    await expect(staking.unstake()).to.be.revertedWith('You have an open vote.');
  });
});