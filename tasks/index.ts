//account
require("./account/accountBalance.ts");
require("./account/accountAddBalance.ts");

//lp
require("./uniswap/uniswapBalanceOf.ts");
require("./uniswap/uniswapSwap.ts");

//xxx
require("./xxx/xxxBalanceOf.ts");
require("./xxx/xxxApprove.ts");

//staking
require("./staking/stakingBasicSetup.ts");
require("./staking/stakingClaim.ts");
require("./staking/stakingStake.ts");
require("./staking/stakingUnstake.ts");

//dao
require("./dao/daoAddProposal.ts");
require("./dao/daoVote.ts");
require("./dao/daoFinish.ts");
require("./dao/daoBurnTokens.ts");
require("./dao/daoSendEthToOwner.ts");
require("./dao/daoTest.ts");

// dao -> burnTokens
require("./dao/burnTokens/burnTokensSetup.ts");
require("./dao/burnTokens/burnTokensProposal.ts");
require("./dao/burnTokens/burnTokensVote.ts");
require("./dao/burnTokens/burnTokensFinish.ts");

//acdmPlatform
require("./acdmPlatform/acdmPlatformBasicSetup.ts");
require("./acdmPlatform/acdmPlatformRegister.ts");
require("./acdmPlatform/acdmPlatformNextRound.ts");
require("./acdmPlatform/acdmPlatformBuyTokens.ts");
require("./acdmPlatform/acdmPlatformMakeOrder.ts");
require("./acdmPlatform/acdmPlatformCloseOrder.ts");
require("./acdmPlatform/acdmPlatformBuyOrder.ts");
