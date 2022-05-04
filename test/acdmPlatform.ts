import {expect} from "chai";
import {ethers} from "hardhat";

describe("acdmPlatform", function () {
    it("All", async function () {
        const [user, user2, user3, user4] = await ethers.getSigners();

        const name = "ACADEM Coin";
        const symbol = "ACDM";
        let decimals = 6;
        let mintBalance = (10 * 1000 * 1000) * 10 ** 6;
        const acdmFactory = await ethers.getContractFactory("ACDMToken");
        const acdm = await acdmFactory.deploy(name, symbol, mintBalance, decimals);

        let roundTime = 24 * 60 * 60;
        const Platform = await ethers.getContractFactory("ACDMPlatform");
        const platform = await Platform.deploy(acdm.address, roundTime);
        await platform.deployed();

        await acdm.transfer(platform.address, mintBalance);

        // register
        await platform.connect(user3).register(ethers.constants.AddressZero);
        await platform.connect(user2).register(user3.address);
        await platform.register(user2.address);
        expect(await platform.getOwnerRef(user.address)).to.equal(user2.address);


        // SALE ROUND
        await platform.nextRound();
        let amount = ethers.utils.parseEther("0.1");
        const options = {value: amount}
        await platform.buyTokens(options);
        let orderAmount = await acdm.balanceOf(user.address);
        let amount2 = ethers.utils.parseEther("0.9");
        const options2 = {value: amount2}
        await platform.connect(user2).buyTokens(options2);
        let orderAmount2 = await acdm.balanceOf(user2.address);


        // TRADE ROUND
        await platform.nextRound();
        //makeOrder
        let price = ethers.utils.parseEther("0.2");
        await acdm.approve(platform.address, orderAmount);
        await platform.makeOrder(orderAmount, price);
        let orderId1 = (await platform.lastOrder());
        await acdm.connect(user2).approve(platform.address, orderAmount2);
        let price2 = ethers.utils.parseEther("2.2");
        await platform.connect(user2).makeOrder(orderAmount2, price2);
        let orderId2 = (await platform.lastOrder());

        //buyOrder
        await platform.connect(user4).buyOrder(orderId1, {value: ethers.utils.parseEther("0.07")})
        await platform.connect(user4).buyOrder(orderId1, {value: ethers.utils.parseEther("0.13")})
        //buyOrder -> The order is not available.
        await expect(platform.buyOrder(orderId1, {value: ethers.utils.parseEther("0.1")}))
            .to.be.revertedWith('The order is not available.');

        //closeOrder
        //closeOrder -> Not the owner.
        await expect(platform.closeOrder(orderId2))
            .to.be.revertedWith('Not the owner.');
        await platform.connect(user2).closeOrder(orderId2);
        //closeOrder -> The order is not available.
        await expect(platform.connect(user2).closeOrder(orderId2))
            .to.be.revertedWith('The order is not available.');

        await ethers.provider.send("evm_increaseTime", [roundTime]);
        await ethers.provider.send("evm_mine", []);
        await platform.nextRound();
    });
});
