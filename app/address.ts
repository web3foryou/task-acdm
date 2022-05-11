export class Address {
    PLATFORM: string;
    DAO: string;
    STAKING: string;
    ACDM: string;
    LP: string;
    XXX: string;
    SWAP: string;
    USER: string;
    WETH: string;

    constructor(network: string) {
        this.PLATFORM = process.env.CONTRACT_PLATFORM as string;
        this.DAO = process.env.CONTRACT_DAO as string;
        this.STAKING = process.env.CONTRACT_STAKING as string;
        this.ACDM = process.env.CONTRACT_ACDM as string;
        this.LP = process.env.CONTRACT_LP as string;
        this.XXX = process.env.CONTRACT_XXX as string;
        this.USER = process.env.ADDRESS_G_1 as string;
        this.SWAP = process.env.CONTRACT_SWAP as string;
        this.WETH = process.env.CONTRACT_WETH as string;

        if (network == "rinkeby") {
            this.PLATFORM = process.env.CONTRACT_PLATFORM_RINKEBY as string;
            this.DAO = process.env.CONTRACT_DAO_RINKEBY as string;
            this.STAKING = process.env.CONTRACT_STAKING_RINKEBY as string;
            this.ACDM = process.env.CONTRACT_ACDM_RINKEBY as string;
            this.LP = process.env.CONTRACT_LP_RINKEBY as string;
            this.XXX = process.env.CONTRACT_XXX_RINKEBY as string;
            this.SWAP = process.env.CONTRACT_SWAP_RINKEBY as string;
            this.WETH = process.env.CONTRACT_WETH_RINKEBY as string;
            this.USER = process.env.ADDRESS_1 as string;
        } else if (network == "ganacheRinkeby") {
            this.PLATFORM = process.env.CONTRACT_PLATFORM_G2 as string;
            this.DAO = process.env.CONTRACT_DAO_G2 as string;
            this.STAKING = process.env.CONTRACT_STAKING_G2 as string;
            this.ACDM = process.env.CONTRACT_ACDM_G2 as string;
            this.LP = process.env.CONTRACT_LP_G2 as string;
            this.XXX = process.env.CONTRACT_XXX_G2 as string;
            this.SWAP = process.env.CONTRACT_SWAP_G2 as string;
            this.WETH = process.env.CONTRACT_WETH_G2 as string;
            this.USER = process.env.ADDRESS_1_G2 as string;
        }
    }
}