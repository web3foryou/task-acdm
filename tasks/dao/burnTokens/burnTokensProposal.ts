import {task} from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
import {Address} from "../../../app/address"

task("burnTokensProposal", "burnTokensProposal")
    .setAction(async (taskArgs, hre) => {

        // Через ДАО голосование пользователи будут решать отдать эту комиссию овнеру или на эти ETH купить XXXToken на uniswap-е а после их сжечь.


        const [signer] = await hre.ethers.getSigners();

        let addresses = new Address(process.env.NETWORK as string);

        const ContractArtifactACDMPlatform = require('../../../artifacts/contracts/ACDMPlatform.sol/ACDMPlatform.json');
        let platform = new hre.ethers.Contract(addresses.PLATFORM, ContractArtifactACDMPlatform.abi, signer);
        let platformSigner = platform.connect(signer);

        const ContractArtifactStaking = require('../../../artifacts/contracts/Staking.sol/Staking.json');
        let staking = new hre.ethers.Contract(addresses.XXX, ContractArtifactStaking.abi, signer);

        const ContractArtifactDao = require('../../../artifacts/contracts/Dao.sol/Dao.json');
        let dao = new hre.ethers.Contract(addresses.DAO, ContractArtifactDao.abi, signer);
        let daoSigner = dao.connect(signer);

        const balance = await hre.ethers.provider.getBalance(platform.address);
        let balance2 = parseInt(balance.toString()) / 10 ** 18;
        console.log("getBalance: " + balance2);

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

