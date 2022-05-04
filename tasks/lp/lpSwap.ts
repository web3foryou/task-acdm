import {task} from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
import {Address} from "../../app/address"

task("lpSwap", "lpSwap")
    .setAction(async (taskArgs, hre) => {
        const [signer] = await hre.ethers.getSigners();

        let addresses = new Address(hre.hardhatArguments.network as string);

        const lpArtifact = require('../../artifacts/contracts/IUniswapLpToken.sol/IUniswapLpToken.json');
        let lp = new hre.ethers.Contract(addresses.LP, lpArtifact.abi, signer);
        let lpSigner = lp.connect(signer);

        const xxxArtifact = require('../../artifacts/contracts/XXXToken.sol/XXXToken.json');
        let xxx = new hre.ethers.Contract(addresses.XXX, xxxArtifact.abi, signer);
        let xxxSigner = xxx.connect(signer);

        let amountIn = hre.ethers.utils.parseEther("2000");
        let amountOutMin = hre.ethers.utils.parseEther("0.001");
        // let amountOutMin = 18 042 007 838 410 927;
        let path = ["0x89b254f400e49509C4a28f31C054548Dac545136", "0xc778417E063141139Fce010982780140Aa0cD5Ab"];
        let address = "0x8994E7Cacd904dafE2Dd6EbcC5342DeeAf71Cd51";
        let deadline = 1652668536;

        let txApprove = await xxxSigner.approve(addresses.LP, amountIn);
        await txApprove.wait();

        let allowance = await xxxSigner.allowance(signer.address, addresses.LP);
        console.log("Allowance: " + allowance);

        // console.log(dataApprove);

        let data = await lpSigner.swapExactTokensForETH(amountIn, amountOutMin, path, address, deadline);

        console.log("data: " + data);
        console.log("Done");
    });

