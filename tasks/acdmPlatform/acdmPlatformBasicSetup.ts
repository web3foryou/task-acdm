import {task} from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
import {Address} from "../../app/address"

task("acdmPlatformNextRound", "acdmPlatformNextRound")
    .setAction(async (taskArgs, hre) => {
        const [signer] = await hre.ethers.getSigners();

        let adresses = new Address(hre.hardhatArguments.network as string);

        const ContractArtifactAcdm = require('../../artifacts/contracts/ACDMToken.sol/ACDMToken.json');
        let acdm = new hre.ethers.Contract(adresses.ACDM, ContractArtifactAcdm.abi, signer);
        let acdmSigner = acdm.connect(signer);

        let tx = await acdmSigner.addMember(adresses.PLATFORM);
        await tx.wait();

        let mintBalance = (10 * 1000 * 1000) * 10 ** 6;
        tx = await acdmSigner.transfer(adresses.PLATFORM, mintBalance);
        await tx.wait();

        console.log("Done");
    });

