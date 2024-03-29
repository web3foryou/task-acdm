import {task} from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
import {Address} from "../../app/address"

task("uniswapBalanceOf", "uniswapBalanceOf")
    .setAction(async (taskArgs, hre) => {
        const [signer] = await hre.ethers.getSigners();

        let addresses = new Address(process.env.NETWORK as string);

        const lpArtifact = require('../../artifacts/contracts/LpToken.sol/LpToken.json');
        let lp = new hre.ethers.Contract(addresses.LP, lpArtifact.abi, signer);
        let lpSigner = lp.connect(signer);

        let balanceOf = await lpSigner.balanceOf(signer.address);

        console.log("address: " + await signer.address);
        console.log("balanceOf: " + balanceOf / 10 ** 18);
        console.log("Done");
    });

