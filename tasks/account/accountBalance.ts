import {task} from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
import {Address} from "../../app/address"

task("accountBalance", "accountBalance")
    .setAction(async (taskArgs, hre) => {
        const [user] = await hre.ethers.getSigners();
        let balance = await user.getBalance();
        let balance2 = parseInt(balance.toString()) / 10 ** 18;
        console.log("getBalance: " + balance2);
        console.log("Done");
    });

