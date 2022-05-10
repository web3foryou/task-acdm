import {task} from "hardhat/config";
import "@nomiclabs/hardhat-waffle";

task("accountAddBalance", "accountAddBalance")
    .setAction(async (taskArgs, hre) => {
        const [user, user2, user3] = await hre.ethers.getSigners();
        console.log("getBalance: " + parseInt((await user.getBalance()).toString()) / 10 ** 18);
        console.log("getBalance: " + parseInt((await user3.getBalance()).toString()) / 10 ** 18);

        let amount = hre.ethers.utils.parseEther("100.0");
        const options2 = {to: user.address, value: amount};
        await user3.sendTransaction(options2);

        console.log("getBalance: " + parseInt((await user.getBalance()).toString()) / 10 ** 18);
        console.log("getBalance: " + parseInt((await user3.getBalance()).toString()) / 10 ** 18);
        console.log("Done");
    });