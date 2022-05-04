import {expect} from "chai";
import {ethers} from "hardhat";

describe("Dao", function () {
    it("All", async function () {
        const [user, user2, user3, user4] = await ethers.getSigners();

        const nameLp = "LP Token";
        const symbolLp = "LP";
        let mintBalance = ethers.utils.parseEther("1000000.0");
        let decimalsLp = 18;
        const Lp = await ethers.getContractFactory("LpToken");
        const lp = await Lp.deploy(nameLp, symbolLp, mintBalance, decimalsLp);
        await lp.deployed();

        // const minQuorum = ethers.utils.parseEther("10.0");
        // const minPeriod = 3 * 24 * 60 * 60;
        // const Dao = await ethers.getContractFactory("Dao");
        // const dao = await Dao.deploy(user.address, erc20.address, minQuorum, minPeriod);
        // await dao.deployed();
        //
        // await erc20.transfer(user2.address, minQuorum);
        // await erc20.transfer(user3.address, minQuorum);
        // await erc20.transfer(user4.address, minQuorum);
        //
        // await erc20.addMember(dao.address);
        //
        // // deposit()
        // const deposit1 = ethers.utils.parseEther("1.0");
        // //deposit -> Don't allowance tokens.
        // await expect(dao.deposit(deposit1))
        //     .to.be.revertedWith('Don\'t allowance tokens.');
        // await erc20.approve(dao.address, deposit1);
        // await dao.deposit(deposit1);
        //
        // //addProposal
        // let newFee = 10;
        // let callData = erc20.interface.encodeFunctionData("setFee", [newFee]);
        // await dao.addProposal(callData, erc20.address, "Change fee")
        // let lastProposal = await dao.lastProposal();
        // //addProposal -> Not chairperson.
        // await expect(dao.connect(user2).addProposal(callData, erc20.address, "Change fee"))
        //     .to.be.revertedWith('Not chairperson.');
        //
        // // vote()
        // await dao.vote(lastProposal, true);
        // const deposit2 = ethers.utils.parseEther("10.0");
        // await erc20.connect(user2).approve(dao.address, deposit2);
        // await dao.connect(user2).deposit(deposit2);
        // await dao.connect(user2).vote(lastProposal, true);
        // // vote() -> Don't have deposit
        // await expect(dao.connect(user3).vote(lastProposal, true))
        //     .to.be.revertedWith('Don\'t have deposit');
        // // vote() -> Already voted.
        // await expect(dao.connect(user2).vote(lastProposal, true))
        //     .to.be.revertedWith('Already voted.');
        // // vote() -> ветка против голосования
        // await erc20.connect(user3).approve(dao.address, deposit2);
        // await dao.connect(user3).deposit(deposit2);
        // await dao.connect(user3).vote(lastProposal, false);
        //
        // // getTokens() -> Existing open offer.
        // await expect(dao.connect(user2).getTokens())
        //     .to.be.revertedWith('Existing open offer.');
        // // getTokens() -> ветка когда нет токенов на голосованиях открытых
        // await erc20.connect(user4).approve(dao.address, deposit2);
        // await dao.connect(user4).deposit(deposit2);
        // await dao.connect(user4).getTokens();
        //
        // // finishProposal()
        // // finishProposal() -> Little time.
        // await expect(dao.finishProposal(lastProposal))
        //     .to.be.revertedWith('Little time.');
        // await ethers.provider.send("evm_increaseTime", [minPeriod]);
        // await ethers.provider.send("evm_mine", []);
        // await dao.finishProposal(lastProposal);
        // expect(await erc20.fee()).to.equal(newFee);
        // // finishProposal() -> Not have proposale.
        // await expect(dao.finishProposal(1000))
        //     .to.be.revertedWith('Not have proposale.');
        // // finishProposal() -> Already finished.
        // await expect(dao.finishProposal(lastProposal))
        //     .to.be.revertedWith('Already finished.');
        //
        // // finishProposal() -> Few votes.
        // await dao.addProposal(callData, erc20.address, "Change fee")
        // let lastProposal2 = await dao.lastProposal();
        // await ethers.provider.send("evm_increaseTime", [minPeriod]);
        // await ethers.provider.send("evm_mine", []);
        // await expect(dao.finishProposal(lastProposal2))
        //     .to.be.revertedWith('Few votes.');
        // // finishProposal() -> ветка не одобрения голосования
        // await dao.vote(lastProposal2, false);
        // await dao.connect(user3).vote(lastProposal2, false);
        // await dao.finishProposal(lastProposal2);
        //
        // //getTokens()
        // await dao.connect(user2).getTokens();
        // expect(await erc20.balanceOf(user2.address)).to.equal(deposit2);
        //
        // // getTokens() -> Don't have tokens.
        // await expect(dao.connect(user2).getTokens())
        //     .to.be.revertedWith('Don\'t have tokens.');

    });
});
