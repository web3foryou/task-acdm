import {task} from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
import {Address} from "../../app/address"
import {log} from "util";
import {platform} from "os";

task("daoTest", "daoTest")
    .setAction(async (taskArgs, hre) => {
        const [signer] = await hre.ethers.getSigners();

        let addresses = new Address(process.env.NETWORK as string);

        const xxxArtifact = require('../../artifacts/contracts/XXXToken.sol/XXXToken.json');
        let xxx = new hre.ethers.Contract(addresses.XXX, xxxArtifact.abi, signer);
        let xxxSigner = xxx.connect(signer);

        const ContractArtifactStaking = require('../../artifacts/contracts/Staking.sol/Staking.json');
        let staking = new hre.ethers.Contract(addresses.STAKING, ContractArtifactStaking.abi, signer);

        const ContractArtifactDao = require('../../artifacts/contracts/Dao.sol/Dao.json');
        let dao = new hre.ethers.Contract(addresses.DAO, ContractArtifactDao.abi, signer);
        let daoSigner = dao.connect(signer);

        await staking.addMember(dao.address);
        await staking.setDao(dao.address);

        const swapArtifact = require('../../artifacts/contracts/IUniswapLpToken.sol/IUniswapLpToken.json');
        let swap = new hre.ethers.Contract(addresses.SWAP, swapArtifact.abi, signer);
        let swapSigner = swap.connect(signer);

        const ContractArtifactPlatform = require('../../artifacts/contracts/ACDMPlatform.sol/ACDMPlatform.json');
        let platform = new hre.ethers.Contract(addresses.PLATFORM, ContractArtifactPlatform.abi, signer);
        let platformSigner = platform.connect(signer);

        await xxxSigner.addMember(platformSigner.address);
        await xxxSigner.addMember(dao.address);

        let tx;

        // ТЕСТОВОЕ меняет лок тайм
        // console.log("lockTime: " + await staking.lockTime())
        // let lockTimeNew = 2 * 24 * 60 * 60;
        // let callData = staking.interface.encodeFunctionData("changeLockTime", [lockTimeNew]);
        // let tx = await daoSigner.test(callData, addresses.STAKING, 0)
        // await tx.wait();
        // console.log("lockTime: " + await staking.lockTime())


        // СВАП ТОКЕНА НА ЭФИР - эфир кидаем на signer, т.к. на контракт не могут быть отправлены токены
        // console.log("balance dao: " + parseInt((await hre.ethers.provider.getBalance(dao.address)).toString()) / 10 ** 18);
        // console.log("balanceOf dao: " + parseInt((await xxxSigner.balanceOf(dao.address)).toString()) / 10 ** 18);
        // let amount = hre.ethers.utils.parseEther("1000");
        // await xxxSigner.transfer(dao.address, amount);
        // console.log("balance dao: " + parseInt((await hre.ethers.provider.getBalance(dao.address)).toString()) / 10 ** 18);
        // console.log("balanceOf dao: " + parseInt((await xxxSigner.balanceOf(dao.address)).toString()) / 10 ** 18);
        // // approve callback
        // let callDataAllowance = xxxSigner.interface.encodeFunctionData("approve", [addresses.SWAP, amount]);
        // tx = await daoSigner.test(callDataAllowance, addresses.XXX, 0)
        // await tx.wait();
        // let allowance = await xxxSigner.allowance(dao.address, addresses.SWAP);
        // let balanceOf = await xxxSigner.balanceOf(dao.address);
        // console.log("balanceOf: " + parseInt((balanceOf).toString()) / 10 ** 18);
        // console.log("Allowance: " + parseInt((allowance).toString()) / 10 ** 18);
        // //swap
        // console.log("eth signer:" + parseInt((await signer.getBalance()).toString()) / 10 ** 18)
        // let path = [addresses.XXX, "0xc778417E063141139Fce010982780140Aa0cD5Ab"];
        // let deadline = 2751767093;
        // let callDataSwap = swapSigner.interface.encodeFunctionData("swapExactTokensForETH", [amount, 0, path, signer.address, deadline]);
        // tx = await daoSigner.test(callDataSwap, addresses.SWAP, 0)
        // await tx.wait();
        // balanceOf = await xxxSigner.balanceOf(dao.address);
        // console.log("balanceOf: " + parseInt((balanceOf).toString()) / 10 ** 18);
        // console.log("hash: " + tx.hash)
        // console.log("eth signer:" + parseInt((await signer.getBalance()).toString()) / 10 ** 18)


        // СВАП ЭФИРА НА ТОКЕНЫ
        // console.log("balance dao: " + parseInt((await hre.ethers.provider.getBalance(dao.address)).toString()) / 10 ** 18);
        // let amount = hre.ethers.utils.parseEther("0.005");
        // const options = {to: dao.address, value: amount};
        // await signer.sendTransaction(options);
        // console.log("balance dao: " + parseInt((await hre.ethers.provider.getBalance(dao.address)).toString()) / 10 ** 18);
        // console.log("balanceOf: " + parseInt((await xxxSigner.balanceOf(dao.address)).toString()) / 10 ** 18);
        // let path = [addresses.WETH, addresses.XXX];
        // let deadline = 2751767093;
        // let callDataSwap = swapSigner.interface.encodeFunctionData("swapExactETHForTokens", [0, path, dao.address, deadline]);
        // tx = await daoSigner.test(callDataSwap, addresses.SWAP, amount)
        // await tx.wait();
        // console.log("balanceOf: " + parseInt((await xxxSigner.balanceOf(dao.address)).toString()) / 10 ** 18);

        // Алгоритм:
        // передача эфира на дао
        // свап с дао и сжигание на дао
        // не красиво!

        // Лучше:
        // свап сразу с контракта платформы
        // нужен метод, который примет колдата и выполнит ее от дао
        // дао должен как-то понять, что колдату надо далее передать
        // пробовать обернуть колдату на нашей стороне

        // СВАП ЭФИРА НА ТОКЕНЫ ЧЕРЕЗ ДАО КОНТРАКТ У КОНТРАКТА ПЛАТФОРМЫ
        // console.log("balance platform: " + parseInt((await hre.ethers.provider.getBalance(addresses.PLATFORM)).toString()));
        // console.log("balance platform: " + parseInt((await hre.ethers.provider.getBalance(addresses.PLATFORM)).toString()) / 10 ** 18);
        // let amount = hre.ethers.utils.parseEther("0.005");
        // const options = {to: platformSigner.address, value: amount};
        // await signer.sendTransaction(options);
        // console.log("balance platform: " + parseInt((await hre.ethers.provider.getBalance(addresses.PLATFORM)).toString()) / 10 ** 18);
        // console.log("totalSupply: " + parseInt((await xxxSigner.totalSupply()).toString()) / 10 ** 18);
        // let callDatabuyAndBurn = platformSigner.interface.encodeFunctionData("buyAndBurn", [addresses.SWAP, addresses.WETH, addresses.XXX]);
        // tx = await daoSigner.test(callDatabuyAndBurn, addresses.PLATFORM)
        // await tx.wait();
        // console.log("totalSupply: " + parseInt((await xxxSigner.totalSupply()).toString()) / 10 ** 18);


        // ОТПРАВКА ЭФИРА ОВНЕРУ
        let amount = hre.ethers.utils.parseEther("0.005");
        const options = {to: platformSigner.address, value: amount};
        await signer.sendTransaction(options);
        console.log("balance platform: " + parseInt((await hre.ethers.provider.getBalance(addresses.PLATFORM)).toString()) / 10 ** 18);
        let callDataSendEthToOwner = platformSigner.interface.encodeFunctionData("sendEthToOwner", []);
        console.log("balance owner: " + parseInt((await hre.ethers.provider.getBalance(signer.address)).toString()) / 10 ** 18);
        tx = await daoSigner.test(callDataSendEthToOwner, addresses.PLATFORM)
        await tx.wait();
        console.log("balance owner: " + parseInt((await hre.ethers.provider.getBalance(signer.address)).toString()) / 10 ** 18);

        // tx = await platformSigner.buyAndBurn(addresses.SWAP, addresses.WETH, addresses.XXX);
        // await tx.wait();
        // console.log("balanceOf: " + parseInt((await xxxSigner.balanceOf(platformSigner.address)).toString()) / 10 ** 18);
        // console.log("lastPrice: " + await platformSigner.lastPrice());

        // в платформу просто добавить две функции, которые будут либо покупать и сжигать токены, либо отдавать их овнеру

        // это должно делать не дао, а контракт платформы!!! через голосование дао!!!

        // пробуем свапнуть токены на эфиры
        // закидываем токены на дао
        // пробуем свапнуть


        console.log("Done");
    });

