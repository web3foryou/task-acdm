import {task} from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
import {Address} from "../../../app/address"

task("burnTokensSetup", "burnTokensSetup")
    .setAction(async (taskArgs, hre) => {

        // Через ДАО голосование пользователи будут решать отдать эту комиссию овнеру или на эти ETH купить XXXToken на uniswap-е а после их сжечь.


        const [signer, user3] = await hre.ethers.getSigners();

        let addresses = new Address(process.env.NETWORK as string);

        const ContractArtifactACDMPlatform = require('../../../artifacts/contracts/ACDMPlatform.sol/ACDMPlatform.json');
        let platform = new hre.ethers.Contract(addresses.PLATFORM, ContractArtifactACDMPlatform.abi, signer);
        let platformSigner = platform.connect(signer);

        const ContractArtifactStaking = require('../../../artifacts/contracts/Staking.sol/Staking.json');
        let staking = new hre.ethers.Contract(addresses.XXX, ContractArtifactStaking.abi, signer);

        const ContractArtifactDao = require('../../../artifacts/contracts/Dao.sol/Dao.json');
        let dao = new hre.ethers.Contract(addresses.DAO, ContractArtifactDao.abi, signer);
        let daoSigner = dao.connect(signer);

        // начисляем контракту эфиров, чтобы сэмулировать что они там были и что-то с ними делать
            console.log(addresses.PLATFORM)

        console.log("getBalance: " + parseInt((await hre.ethers.provider.getBalance(platform.address)).toString()) / 10 ** 18);

        console.log("Done");

        // let lockTimeNew = 4 * 24 * 60 * 60;
        // let callData = staking.interface.encodeFunctionData("changeLockTime", [lockTimeNew]);
        // let tx = await daoSigner.addProposal([callData], [addresses.STAKING], "changeLockTime")
        // await tx.wait();
        // let lastProposal = await daoSigner.lastProposal();

        // проверяем сколько эфира на контакте
        // таск на отправку эфира 0.01
        // выкуп токенов на юнисвапе
        // сжигание токенов

        // console.log("lastProposal: " + lastProposal);
        console.log("Done");
    });

