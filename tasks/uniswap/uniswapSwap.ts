import {task} from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
import {Address} from "../../app/address"

task("uniswapSwap", "uniswapSwap")
    .setAction(async (taskArgs, hre) => {
        const [signer] = await hre.ethers.getSigners();

        let addresses = new Address(process.env.NETWORK as string);

        const lpArtifact = require('../../artifacts/contracts/IUniswapLpToken.sol/IUniswapLpToken.json');
        let swap = new hre.ethers.Contract(addresses.SWAP, lpArtifact.abi, signer);
        let swapSigner = swap.connect(signer);

        const xxxArtifact = require('../../artifacts/contracts/XXXToken.sol/XXXToken.json');
        let xxx = new hre.ethers.Contract(addresses.XXX, xxxArtifact.abi, signer);
        let xxxSigner = xxx.connect(signer);

        let amountIn = hre.ethers.utils.parseEther("1500");
        let amountOutMin = hre.ethers.utils.parseEther("0.001");
        // let amountOutMin = 18 042 007 838 410 927;
        let path = ["0x89b254f400e49509C4a28f31C054548Dac545136", "0xc778417E063141139Fce010982780140Aa0cD5Ab"];
        let deadline = 2751767093;

        let allowance = await xxxSigner.allowance(signer.address, addresses.SWAP);
        let balanceOf = await xxxSigner.balanceOf(signer.address);
        console.log("balanceOf: " + parseInt((balanceOf).toString()) / 10 ** 18);
        console.log("Allowance: " + parseInt((allowance).toString()) / 10 ** 18);

        let tx = await swapSigner.swapExactTokensForETH(amountIn, 0, path, signer.address, deadline);
        await tx.wait();
        balanceOf = await xxxSigner.balanceOf(signer.address);
        console.log("balanceOf: " + parseInt((balanceOf).toString()) / 10 ** 18);
        console.log("hash: " + tx.hash)
        console.log("Done");
    });

