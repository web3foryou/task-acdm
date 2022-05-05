import {task} from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
import {Address} from "../../app/address";

task("daoVote", "daoVote")
    .setAction(async (taskArgs, hre) => {
        const [signer] = await hre.ethers.getSigners();

        let adresses = new Address(hre.hardhatArguments.network as string);

        const ContractArtifactErc20 = require('../../artifacts/contracts/XXXToken.sol/XXXToken.json');
        let erc20 = new hre.ethers.Contract(adresses.XXX, ContractArtifactErc20.abi, signer);
        let erc20Signer = erc20.connect(signer);

        const ContractArtifactDao = require('../../artifacts/contracts/Dao.sol/Dao.json');
        let dao = new hre.ethers.Contract(adresses.DAO, ContractArtifactDao.abi, signer);
        let daoSigner = dao.connect(signer);

        let lastProposal = await daoSigner.lastProposal();
        let tx = await daoSigner.vote(lastProposal, true);
        await tx.wait();

        console.log("lastProposal: " + lastProposal);
        console.log("Done");
    });

