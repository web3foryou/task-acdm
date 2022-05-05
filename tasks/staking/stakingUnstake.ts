import {task} from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
import {Address} from "../../app/address"

task("stakingUnstake", "stakingUnstake")
    .setAction(async (taskArgs, hre) => {
        let addresses = new Address(process.env.NETWORK as string);

        const [user] = await hre.ethers.getSigners();

        const ContractStakingArtifact = require('../../artifacts/contracts/Staking.sol/Staking.json');
        let contractStaking = new hre.ethers.Contract(addresses.STAKING, ContractStakingArtifact.abi, user);
        let contractStakingSigner = contractStaking.connect(user);

        if (hre.hardhatArguments.network as string == "ganache") {
            const minPeriod = 3 * 24 * 60 * 60;
            await hre.ethers.provider.send("evm_increaseTime", [minPeriod]);
            await hre.ethers.provider.send("evm_mine", []);
        }

        console.log("balanceOf: " + await contractStaking.balanceOf(user.address));
        await contractStakingSigner.unstake();
        console.log("balanceOf: " + await contractStaking.balanceOf(user.address));

        console.log("done")
    });

