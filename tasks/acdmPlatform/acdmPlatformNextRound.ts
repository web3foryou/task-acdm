import {task} from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
import {Address} from "../../app/address"

task("acdmPlatformNextRound", "acdmPlatformNextRound")
    .setAction(async (taskArgs, hre) => {
        const [signer] = await hre.ethers.getSigners();

        let addresses = new Address(process.env.NETWORK as string);

        const ContractArtifactPlatform = require('../../artifacts/contracts/ACDMPlatform.sol/ACDMPlatform.json');
        let platform = new hre.ethers.Contract(addresses.PLATFORM, ContractArtifactPlatform.abi, signer);
        let platformSigner = platform.connect(signer);

        if (process.env.NETWORK as string == "ganache") {
            let roundTime = 24 * 60 * 60;
            await hre.ethers.provider.send("evm_increaseTime", [roundTime]);
            await hre.ethers.provider.send("evm_mine", []);
        }

        let tx = await platformSigner.nextRound();
        await tx.wait();

        console.log("roundSale: " + await platformSigner.roundSale());
        console.log("Done");
    });

