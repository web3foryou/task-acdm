import {task} from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
import {Address} from "../../app/address"

task("uniswapLpBalanceOf", "uniswapLpBalanceOf")
    .setAction(async (taskArgs, hre) => {
        const [signer] = await hre.ethers.getSigners();

        let addresses = new Address(hre.hardhatArguments.network as string);

        const lpArtifact = require('../../artifacts/contracts/LpToken.sol/LpToken.json');
        let lp = new hre.ethers.Contract(addresses.LP, lpArtifact.abi, signer);
        let lpSigner = lp.connect(signer);

        let balanceOf = await lpSigner.balanceOf(signer.address);

        console.log("balanceOf: " + balanceOf);
        console.log("Done");
    });

