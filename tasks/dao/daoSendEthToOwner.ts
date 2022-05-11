import {task} from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
import {Address} from "../../app/address"
import {log} from "util";
import {platform} from "os";

task("daoSendEthToOwner", "daoSendEthToOwner")
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

        // await platformSigner.addMember(dao.address);

        let tx;

        // заливаем баланс для теста
        console.log("balance platform: " + parseInt((await hre.ethers.provider.getBalance(addresses.PLATFORM)).toString()) / 10 ** 18);
        let amount = hre.ethers.utils.parseEther("0.005");
        const options = {to: platformSigner.address, value: amount};
        await signer.sendTransaction(options);
        console.log("balance platform: " + parseInt((await hre.ethers.provider.getBalance(addresses.PLATFORM)).toString()) / 10 ** 18);

        // Размещаем предложение
        let lockTimeNew = 4 * 24 * 60 * 60;
        let callDataSendEthToOwner = platformSigner.interface.encodeFunctionData("sendEthToOwner", []);
        tx = await daoSigner.addProposal([callDataSendEthToOwner], [addresses.PLATFORM], "buyAndBurn")
        await tx.wait();
        let lastProposal = await daoSigner.lastProposal();
        console.log("lastProposal: " + lastProposal);

        // голосуем
        tx = await daoSigner.vote(lastProposal, true);
        await tx.wait();

        // финиш голосования
        console.log("balance owner: " + parseInt((await hre.ethers.provider.getBalance(signer.address)).toString()) / 10 ** 18);
        if (process.env.NETWORK as string == "ganache" || process.env.NETWORK as string == "ganacheRinkeby") {
            const minPeriod = 3 * 24 * 60 * 60;
            await hre.ethers.provider.send("evm_increaseTime", [minPeriod]);
            await hre.ethers.provider.send("evm_mine", []);
        }
        tx = await dao.finishProposal(lastProposal);
        await tx.wait();
        console.log("balance owner: " + parseInt((await hre.ethers.provider.getBalance(signer.address)).toString()) / 10 ** 18);
        console.log("Done");
    });

