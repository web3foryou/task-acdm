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

        await acdm.addMember(platform.address);

        await acdm.transfer(platform.address, mintBalance);

        // register
        await platform.connect(user3).register(ethers.constants.AddressZero);
        // register -> Already registered
        await expect(platform.connect(user3).register(ethers.constants.AddressZero))
            .to.be.revertedWith('Already registered');
        await platform.connect(user2).register(user3.address);
        await platform.register(user2.address);
        expect(await platform.getOwnerRef(user.address)).to.equal(user2.address);

        // SALE ROUND
        await platform.nextRound();
        let amount = ethers.utils.parseEther("0.1");
        const options = {value: amount}
        await platform.buyTokens(options);
        let orderAmount = await acdm.balanceOf(user.address);
        let amount2 = ethers.utils.parseEther("0.8");
        const options2 = {value: amount2}
        await platform.connect(user2).buyTokens(options2);
        let orderAmount2 = await acdm.balanceOf(user2.address);
        let amount3 = ethers.utils.parseEther("0.1");
        const options3 = {value: amount3}
        await platform.connect(user3).buyTokens(options3);
        let orderAmount3 = await acdm.balanceOf(user3.address);
        //buyTokens -> No tokens for sale.
        await expect(platform.connect(user2).buyTokens(options2))
            .to.be.revertedWith('No tokens for sale.');

        // makeOrder -> Sale round
        let price0 = ethers.utils.parseEther("0.1");
        await acdm.approve(platform.address, orderAmount);
        await expect(platform.makeOrder(orderAmount, price0))
            .to.be.revertedWith('Sale round');

        // TRADE ROUND
        await platform.nextRound();
        //makeOrder
        let price = ethers.utils.parseEther("0.2");
        // makeOrder -> Don't allowance.
        await expect(platform.makeOrder(orderAmount2, price))
            .to.be.revertedWith('Don\'t allowance.');
        await expect(platform.makeOrder(0, price))
            .to.be.revertedWith('Amount = 0');
        await expect(platform.makeOrder(orderAmount, 0))
            .to.be.revertedWith('Price = 0');
        await acdm.approve(platform.address, orderAmount);
        await platform.makeOrder(orderAmount, price);
        let orderId1 = (await platform.lastOrder());
        await acdm.connect(user2).approve(platform.address, orderAmount2);
        let price2 = ethers.utils.parseEther("2.2");
        await platform.connect(user2).makeOrder(orderAmount2, price2);
        let orderId2 = (await platform.lastOrder());
        let price3 = ethers.utils.parseEther("2");
        await acdm.connect(user3).approve(platform.address, orderAmount3);
        await platform.connect(user3).makeOrder(orderAmount3, price3);
        let orderId3 = (await platform.lastOrder());

        //buyTokens -> Trade round
        await expect(platform.connect(user2).buyTokens(options2))
            .to.be.revertedWith('Trade round');

        //buyOrder
        await expect(platform.connect(user4).buyOrder(10, {value: ethers.utils.parseEther("0.07")}))
            .to.be.revertedWith('Don\'t exist this order.');
        await expect(platform.connect(user4).buyOrder(orderId1, {value: ethers.utils.parseEther("100")}))
            .to.be.revertedWith('Over Price.');
        await platform.connect(user4).buyOrder(orderId1, {value: ethers.utils.parseEther("0.07")})
        await platform.connect(user4).buyOrder(orderId1, {value: ethers.utils.parseEther("0.13")})
        //buyOrder -> The order is not available.
        await expect(platform.buyOrder(orderId1, {value: ethers.utils.parseEther("0.1")}))
            .to.be.revertedWith('The order is not available.');
        await platform.connect(user2).buyOrder(orderId2, {value: ethers.utils.parseEther("0.07")})
        await platform.connect(user3).buyOrder(orderId3, {value: ethers.utils.parseEther("0.07")})

        //closeOrder
        //closeOrder -> Not the owner.
        await expect(platform.closeOrder(orderId2))
            .to.be.revertedWith('Not the owner.');
        await platform.connect(user2).closeOrder(orderId2);
        //closeOrder -> The order is not available.
        await expect(platform.connect(user2).closeOrder(orderId2))
            .to.be.revertedWith('The order is not available.');
        await expect(platform.connect(user2).closeOrder(10))
            .to.be.revertedWith('Don\'t exist this order.');

        //nextRound => Trade round not over.
        await expect(platform.nextRound())
            .to.be.revertedWith('Trade round not over.');
        await ethers.provider.send("evm_increaseTime", [roundTime]);
        await ethers.provider.send("evm_mine", []);
        await platform.nextRound();
        await expect(platform.connect(user4).buyOrder(orderId2, {value: ethers.utils.parseEther("0.07")}))
            .to.be.revertedWith('Sale round');
        //buyTokens -> ветка без рефералов
        await platform.connect(user3).buyTokens(options);

        //nextRound => Sale round not over.
        await expect(platform.nextRound())
            .to.be.revertedWith('Sale round not over.');
        await ethers.provider.send("evm_increaseTime", [roundTime]);
        await ethers.provider.send("evm_mine", []);

        // для сжигания токенов
        await platform.nextRound();

    });
});
