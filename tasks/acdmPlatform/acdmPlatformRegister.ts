import {task} from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
import {Address} from "../../app/address"

task("acdmPlatformRegister", "acdmPlatformRegister")
    .setAction(async (taskArgs, hre) => {
        const [signer] = await hre.ethers.getSigners();

        let adresses = new Address(hre.hardhatArguments.network as string);

        const ContractArtifactPlatform = require('../../artifacts/contracts/ACDMPlatform.sol/ACDMPlatform.json');
        let platform = new hre.ethers.Contract(adresses.PLATFORM, ContractArtifactPlatform.abi, signer);
        let platformSigner = platform.connect(signer);

        let tx = await platformSigner.register(signer.address);
        await tx.wait();

        console.log("Done");
    });

