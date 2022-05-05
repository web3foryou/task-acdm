import {task} from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
import {Address} from "../../app/address"

task("uniswapLpSwap", "uniswapLpSwap")
    .setAction(async (taskArgs, hre) => {
        const [signer] = await hre.ethers.getSigners();

        let addresses = new Address(process.env.NETWORK as string);

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
        let deadline = 1751767093;
        // let deadline = Number.MAX_SAFE_INTEGER;

            console.log(deadline)

        let txApprove = await xxxSigner.approve(addresses.LP, amountIn);
        await txApprove.wait();

        let allowance = await xxxSigner.allowance(signer.address, addresses.LP);
        console.log("Allowance: " + allowance);

        let tx = await lpSigner.swapExactTokensForETH(amountIn, 0, path, signer.address, deadline);
        // let tx = await lpSigner.swapExactTokensForETHSupportingFeeOnTransferTokens(amountIn, amountOutMin, path, signer.address, deadline);
        await tx.wait();

        console.log("Done");
    });

