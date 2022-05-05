import {task} from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
import {Address} from "../../app/address"

task("daoFinish", "daoFinish")
    .setAction(async (taskArgs, hre) => {
        const [signer] = await hre.ethers.getSigners();

        let addresses = new Address(process.env.NETWORK as string);

        const ContractArtifactStaking = require('../../artifacts/contracts/Staking.sol/Staking.json');
        let staking = new hre.ethers.Contract(addresses.STAKING, ContractArtifactStaking.abi, signer);
        let stakingSigner = staking.connect(signer);

        const ContractArtifactDao = require('../../artifacts/contracts/Dao.sol/Dao.json');
        let dao = new hre.ethers.Contract(addresses.DAO, ContractArtifactDao.abi, signer);
        let daoSigner = dao.connect(signer);

        if (process.env.NETWORK as string == "ganache") {
            const minPeriod = 3 * 24 * 60 * 60;
            await hre.ethers.provider.send("evm_increaseTime", [minPeriod]);
            await hre.ethers.provider.send("evm_mine", []);
        }

        let lastProposal = await daoSigner.lastProposal();
        console.log("lastProposal: " + lastProposal);
        console.log("lockTime before: " + await stakingSigner.lockTime());

        let tx = await dao.finishProposal(lastProposal);
        await tx.wait();

        console.log("lockTime after: " + await stakingSigner.lockTime());
        console.log("Done");
    });

