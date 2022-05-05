import {task} from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
import {Address} from "../../app/address"

task("acdmPlatformBuyTokens", "acdmPlatformBuyTokens")
    .setAction(async (taskArgs, hre) => {
        const [signer] = await hre.ethers.getSigners();

        let addresses = new Address(process.env.NETWORK as string);

        const ContractArtifactPlatform = require('../../artifacts/contracts/ACDMPlatform.sol/ACDMPlatform.json');
        let platform = new hre.ethers.Contract(addresses.PLATFORM, ContractArtifactPlatform.abi, signer);
        let platformSigner = platform.connect(signer);

        const ContractArtifactAcdm = require('../../artifacts/contracts/ACDMToken.sol/ACDMToken.json');
        let acdm = new hre.ethers.Contract(addresses.ACDM, ContractArtifactAcdm.abi, signer);
        let acdmSigner = acdm.connect(signer);

        let amount = hre.ethers.utils.parseEther("0.1");
        const options = {value: amount}
        let tx = await platformSigner.buyTokens(options);
        await tx.wait();

        let balanceOf = await acdm.balanceOf(signer.address)
        console.log("balanceOf: " + balanceOf);
        console.log("Done");
    });

