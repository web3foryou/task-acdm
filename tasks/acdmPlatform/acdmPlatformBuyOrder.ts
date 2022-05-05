import {task} from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
import {Address} from "../../app/address"

task("acdmPlatformBuyOrder", "acdmPlatformBuyOrder")
    .setAction(async (taskArgs, hre) => {
        const [signer, user2] = await hre.ethers.getSigners();

        let addresses = new Address(process.env.NETWORK as string);

        const ContractArtifactPlatform = require('../../artifacts/contracts/ACDMPlatform.sol/ACDMPlatform.json');
        let platform = new hre.ethers.Contract(addresses.PLATFORM, ContractArtifactPlatform.abi, signer);
        let platformSigner = platform.connect(signer);

        const ContractArtifactAcdm = require('../../artifacts/contracts/ACDMToken.sol/ACDMToken.json');
        let acdm = new hre.ethers.Contract(addresses.ACDM, ContractArtifactAcdm.abi, signer);
        let acdmSigner = acdm.connect(signer);

        console.log("balanceOf: " + await acdm.balanceOf(user2.address));

        let tx;
        let lastOrder = await platform.lastOrder();
        tx = await platform.connect(user2).buyOrder(lastOrder, {value: hre.ethers.utils.parseEther("0.07")})
        await tx.wait();

        console.log("balanceOf: " + await acdm.balanceOf(user2.address));
        console.log("lastOrder: " + await platform.lastOrder());
        console.log("Done");
    });

