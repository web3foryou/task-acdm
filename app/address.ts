export class Address {
    PLATFORM: string;
    DAO: string;
    STAKING: string;
    ACDM: string;
    LP: string;
    LP_TEST: string;
    XXX: string;
    USER: string;

    constructor(network: string) {
        this.PLATFORM = process.env.CONTRACT_PLATFORM as string;
        this.DAO = process.env.CONTRACT_DAO as string;
        this.STAKING = process.env.CONTRACT_STAKING as string;
        this.ACDM = process.env.CONTRACT_ACDM as string;
        this.LP = process.env.CONTRACT_LP as string;
        this.XXX = process.env.CONTRACT_XXX as string;
        this.USER = process.env.ADDRESS_G_1 as string;

        if (network == "rinkeby") {
            this.PLATFORM = process.env.CONTRACT_PLATFORM_RINKEBY as string;
            this.DAO = process.env.CONTRACT_DAO_RINKEBY as string;
            this.STAKING = process.env.CONTRACT_STAKING_RINKEBY as string;
            this.ACDM = process.env.CONTRACT_ACDM_RINKEBY as string;
            this.LP = process.env.CONTRACT_LP_RINKEBY as string;
            this.XXX = process.env.CONTRACT_XXX_RINKEBY as string;
            this.USER = process.env.ADDRESS_1 as string;
        } else if (network == "ganache2") {
            this.PLATFORM = process.env.CONTRACT_PLATFORM_G2 as string;
            this.DAO = process.env.CONTRACT_DAO_RINKEBY_G2 as string;
            this.STAKING = process.env.CONTRACT_STAKING_RINKEBY_G2 as string;
            this.ACDM = process.env.CONTRACT_ACDM_RINKEBY_G2 as string;
            this.LP = process.env.CONTRACT_LP_RINKEBY_G2 as string;
            this.XXX = process.env.CONTRACT_XXX_RINKEBY_G2 as string;
            this.USER = process.env.ADDRESS_1_G2 as string;
        }
    }
}