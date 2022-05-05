import {task} from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
import {Address} from "../../app/address"

task("daoAddProposal", "daoAddProposal")
    .setAction(async (taskArgs, hre) => {
        const [signer] = await hre.ethers.getSigners();

        let adresses = new Address(hre.hardhatArguments.network as string);

        const ContractArtifactStaking = require('../../artifacts/contracts/Staking.sol/Staking.json');
        let staking = new hre.ethers.Contract(adresses.XXX, ContractArtifactStaking.abi, signer);

        const ContractArtifactDao = require('../../artifacts/contracts/Dao.sol/Dao.json');
        let dao = new hre.ethers.Contract(adresses.DAO, ContractArtifactDao.abi, signer);
        let daoSigner = dao.connect(signer);

        let lockTimeNew = 4 * 24 * 60 * 60;
        let callData = staking.interface.encodeFunctionData("changeLockTime", [lockTimeNew]);
        await dao.addProposal(callData, staking.address, "changeLockTime")

        let tx = await daoSigner.addProposal(callData, adresses.STAKING, "changeLockTime")
        await tx.wait();
        let lastProposal = await daoSigner.lastProposal();

        console.log("lastProposal: " + lastProposal);
        console.log("Done");
    });

