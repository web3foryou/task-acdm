import {task} from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
import {Address} from "../../app/address"

task("xxxApprove", "xxxApprove")
    .setAction(async (taskArgs, hre) => {
        const [signer] = await hre.ethers.getSigners();

        let addresses = new Address(process.env.NETWORK as string);

        const xxxArtifact = require('../../artifacts/contracts/XXXToken.sol/XXXToken.json');
        let xxx = new hre.ethers.Contract(addresses.XXX, xxxArtifact.abi, signer);
        let xxxSigner = xxx.connect(signer);

        let balanceOf = await xxxSigner.balanceOf(signer.address);
        console.log("balanceOf: " + balanceOf);

        let amountIn = hre.ethers.utils.parseEther("4000");

        let txApprove = await xxxSigner.approve(addresses.LP, amountIn);
        await txApprove.wait();

        let allowance = await xxxSigner.allowance(signer.address, addresses.LP);
        console.log("Allowance: " + allowance);
        console.log("Done");
    });

