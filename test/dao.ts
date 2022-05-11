import {expect} from "chai";
import {ethers} from "hardhat";

describe("Dao", function () {
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

    it("All", async function () {
        const [user, user2, user3, user4] = await ethers.getSigners();

        const [lp, xxx, staking, dao] = await deploy();

        const minQuorum = ethers.utils.parseEther("10.0");
        const minPeriod = 3 * 24 * 60 * 60;

        await lp.transfer(user2.address, minQuorum);
        await lp.transfer(user3.address, minQuorum);
        await lp.transfer(user4.address, minQuorum);

        // deposit()
        const deposit1 = ethers.utils.parseEther("1.0");
        await lp.approve(staking.address, deposit1);
        await staking.stake(deposit1);

        //addProposal
        let lockTimeNew = 2 * 24 * 60 * 60;
        let callData = staking.interface.encodeFunctionData("changeLockTime", [lockTimeNew]);
        await dao.addProposal([callData], [staking.address], [0], "changeLockTime");
        let lastProposal = await dao.lastProposal();

        // addProposal -> Not chairperson.
        await expect(dao.connect(user2).addProposal([callData], [staking.address], [0], "changeLockTime"))
            .to.be.revertedWith('Not chairperson.');

        // vote()
        await dao.vote(lastProposal, true);
        const deposit2 = ethers.utils.parseEther("10.0");
        await lp.connect(user2).approve(staking.address, deposit2);
        await staking.connect(user2).stake(deposit2);
        await dao.connect(user2).vote(lastProposal, true);
        // vote() -> Don't have deposit
        await expect(dao.connect(user3).vote(lastProposal, true))
            .to.be.revertedWith('Don\'t have deposit');
        // vote() -> Already voted.
        await expect(dao.connect(user2).vote(lastProposal, true))
            .to.be.revertedWith('Already voted.');
        // vote() -> ветка против голосования
        await lp.connect(user3).approve(staking.address, deposit2);
        await staking.connect(user3).stake(deposit2);
        await dao.connect(user3).vote(lastProposal, false);

        // getTokens() -> Existing open offer. -> false
        expect(await dao.checkForUnstake(user2.address)).to.equal(false);
        // getTokens() -> ветка когда нет токенов на голосованиях открытых
        await lp.connect(user4).approve(staking.address, deposit2);
        await staking.connect(user4).stake(deposit2);
        expect(await dao.checkForUnstake(user4.address)).to.equal(true);

        // finishProposal()
        // finishProposal() -> Little time.
        await expect(dao.finishProposal(lastProposal))
            .to.be.revertedWith('Little time.');
        await ethers.provider.send("evm_increaseTime", [minPeriod]);
        await ethers.provider.send("evm_mine", []);
        await dao.finishProposal(lastProposal);
        expect(await staking.lockTime()).to.equal(lockTimeNew);
        // finishProposal() -> Not have proposale.
        await expect(dao.finishProposal(1000))
            .to.be.revertedWith('Not have proposale.');
        // finishProposal() -> Already finished.
        await expect(dao.finishProposal(lastProposal))
            .to.be.revertedWith('Already finished.');

        // finishProposal() -> Few votes.
        await dao.addProposal([callData], [staking.address], [0], "changeLockTime")
        let lastProposal2 = await dao.lastProposal();
        await ethers.provider.send("evm_increaseTime", [minPeriod]);
        await ethers.provider.send("evm_mine", []);
        await expect(dao.finishProposal(lastProposal2))
            .to.be.revertedWith('Few votes.');
        // finishProposal() -> ветка не одобрения голосования
        await dao.vote(lastProposal2, false);
        await dao.connect(user3).vote(lastProposal2, false);
        await dao.finishProposal(lastProposal2);

        // ветка с закрытым голосованием
        await dao.checkForUnstake(user4.address);
    });
});
