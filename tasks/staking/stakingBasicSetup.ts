import {task} from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
import {Address} from "../../app/address"

task("stakingBasicSetup", "stakingBasicSetup")
    .setAction(async (taskArgs, hre) => {
        let adresses = new Address(hre.hardhatArguments.network as string);

        const [signer] = await hre.ethers.getSigners();

        const ContractStakingArtifact = require('../../artifacts/contracts/Staking.sol/Staking.json');
        let contractStaking = new hre.ethers.Contract(adresses.STAKING, ContractStakingArtifact.abi, signer);
        let contractStakingSigner = contractStaking.connect(signer);

        const ContractArtifact = require('../../artifacts/contracts/XXXToken.sol/XXXToken.json');

        let contract = new hre.ethers.Contract(adresses.XXX, ContractArtifact.abi, signer);

        let contractSigner = contract.connect(signer);

        let amount = hre.ethers.utils.parseEther("100");

        console.log("Balance: " + await contractSigner.balanceOf(adresses.STAKING));
        let tx = await contractSigner.transfer(adresses.STAKING, amount);
        await tx.wait();
        console.log("Balance: " + await contractSigner.balanceOf(adresses.STAKING));

        tx = await contractStaking.addMember(adresses.DAO);
        await tx.wait();
        tx = await contractStaking.setDao(adresses.DAO);
        await tx.wait();
    });