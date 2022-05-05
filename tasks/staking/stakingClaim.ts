import {task} from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
import {Address} from "../../app/address"

task("stakingClaim", "stakingClaim")
    .setAction(async (taskArgs, hre) => {
        let addresses = new Address(process.env.NETWORK as string);

        const [user] = await hre.ethers.getSigners();

        const ContractStakingArtifact = require('../../artifacts/contracts/Staking.sol/Staking.json');
        let contractStaking = new hre.ethers.Contract(addresses.STAKING, ContractStakingArtifact.abi, user);
        let contractStakingSigner = contractStaking.connect(user);

        const ContractErc20Artifact = require('../../artifacts/contracts/XXXToken.sol/XXXToken.json');
        let contractErc20 = new hre.ethers.Contract(addresses.XXX, ContractErc20Artifact.abi, user);
        let contractErc20Signer = contractStaking.connect(user);

        if (process.env.NETWORK as string == "ganache") {
            const minPeriod = 3 * 24 * 60 * 60;
            await hre.ethers.provider.send("evm_increaseTime", [minPeriod]);
            await hre.ethers.provider.send("evm_mine", []);
        }

        console.log("balanceOf: " + await contractErc20.balanceOf(user.address));
        await contractStakingSigner.claim();
        console.log("balanceOf: " + await contractErc20.balanceOf(user.address));

        console.log("done")
    });

