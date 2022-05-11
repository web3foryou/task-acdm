import {expect} from "chai";
import {ethers} from "hardhat";

describe("Test", function () {
    it("All", async function () {
        const [user, user2, user3, user4] = await ethers.getSigners();

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

        const testFactory = await ethers.getContractFactory("Test");
        const test = await testFactory.deploy();
        await test.deployed();

        const minQuorum = ethers.utils.parseEther("10.0");
        const minPeriod = 3 * 24 * 60 * 60;
        const Dao = await ethers.getContractFactory("Dao");
        const dao = await Dao.deploy(user.address, minQuorum, minPeriod, staking.address);
        await dao.deployed();

        await staking.addMember(dao.address);
        await staking.setDao(dao.address);

        console.log("lockTime: " + await staking.lockTime())

        //addProposal
        let lockTimeNew = 2 * 24 * 60 * 60;
        let callData = staking.interface.encodeFunctionData("changeLockTime", [lockTimeNew]);
        await dao.test(callData, staking.address);

        // переносим в таску
        // заставляем свапнуть токены
        // надо за эфиры свапнуть

        console.log("lockTime: " + await staking.lockTime())

    });
});
