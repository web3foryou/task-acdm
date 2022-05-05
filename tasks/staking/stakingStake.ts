import {task} from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
import {Address} from "../../app/address"

task("stakingStake", "stakingStake")
    .setAction(async (taskArgs, hre) => {
        let adresses = new Address(hre.hardhatArguments.network as string);

        const [user] = await hre.ethers.getSigners();

        const ContractLPArtifact = require('../../artifacts/contracts/LpToken.sol/LpToken.json');
        let contractLP = new hre.ethers.Contract(adresses.LP, ContractLPArtifact.abi, user);
        let contractLpSigner = contractLP.connect(user);

        const ContractStakingArtifact = require('../../artifacts/contracts/Staking.sol/Staking.json');
        let contractStaking = new hre.ethers.Contract(adresses.STAKING, ContractStakingArtifact.abi, user);
        let contractStakingSigner = contractStaking.connect(user);

        let stakingAmount = hre.ethers.utils.parseEther("10.0");
        await contractLpSigner.approve(adresses.STAKING, stakingAmount);
        await contractStakingSigner.stake(stakingAmount);

        console.log("contractStaking balanceOf: " + await contractStakingSigner.balanceOf(user.address));
        console.log("contractLp balanceOf: " + await contractLpSigner.balanceOf(adresses.STAKING));

        console.log("done")
    });

