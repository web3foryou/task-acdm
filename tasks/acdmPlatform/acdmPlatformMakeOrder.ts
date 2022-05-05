import {task} from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
import {Address} from "../../app/address"

task("acdmPlatformMakeOrder", "acdmPlatformMakeOrder")
    .setAction(async (taskArgs, hre) => {
        const [signer] = await hre.ethers.getSigners();

        let addresses = new Address(process.env.NETWORK as string);

        const ContractArtifactPlatform = require('../../artifacts/contracts/ACDMPlatform.sol/ACDMPlatform.json');
        let platform = new hre.ethers.Contract(addresses.PLATFORM, ContractArtifactPlatform.abi, signer);
        let platformSigner = platform.connect(signer);

        const ContractArtifactAcdm = require('../../artifacts/contracts/ACDMToken.sol/ACDMToken.json');
        let acdm = new hre.ethers.Contract(addresses.ACDM, ContractArtifactAcdm.abi, signer);
        let acdmSigner = acdm.connect(signer);

        let balanceOf = await acdm.balanceOf(signer.address)

        let price = hre.ethers.utils.parseEther("1");

        let tx = await acdm.approve(platform.address, balanceOf);
        await tx.wait();

        tx = await platform.makeOrder(balanceOf, price);
        await tx.wait();

        console.log("balanceOf: " + balanceOf);
        console.log("lastOrder: " + await platform.lastOrder());
        console.log("Done");
    });

