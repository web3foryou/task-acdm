import {task} from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
import {Address} from "../../app/address"

task("stakingBasicSetup", "stakingBasicSetup")
    .setAction(async (taskArgs, hre) => {
        let addresses = new Address(process.env.NETWORK as string);

        const [signer] = await hre.ethers.getSigners();

        const ContractStakingArtifact = require('../../artifacts/contracts/Staking.sol/Staking.json');
        let contractStaking = new hre.ethers.Contract(addresses.STAKING, ContractStakingArtifact.abi, signer);
        let contractStakingSigner = contractStaking.connect(signer);

        const ContractArtifact = require('../../artifacts/contracts/XXXToken.sol/XXXToken.json');

        let contract = new hre.ethers.Contract(addresses.XXX, ContractArtifact.abi, signer);

        let contractSigner = contract.connect(signer);

        let amount = hre.ethers.utils.parseEther("100");

        console.log("Balance: " + await contractSigner.balanceOf(addresses.STAKING));
        let tx = await contractSigner.transfer(addresses.STAKING, amount);
        await tx.wait();
        console.log("Balance: " + await contractSigner.balanceOf(addresses.STAKING));

        tx = await contractStaking.addMember(addresses.DAO);
        await tx.wait();
        tx = await contractStaking.setDao(addresses.DAO);
        await tx.wait();
    });