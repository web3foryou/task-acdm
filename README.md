# ACDM sales platform
The platform will consist of several contracts (ACDMToken, XXXToken, Staking, DAO, ACDMPlatform).

#### ACDMToken description
* name = ACADEM Coin
* symbol = ACDM
* decimals = 6

#### XXXToken description
* name = XXX Coin
* symbol = XXX
* decimals = 18

XXXToken must be uploaded to uniswap. The initial price of the token is 0.00001 ETH.

### Staking description
Stacking contract accepts LP tokens(XXX/ETH). Staked tokens are locked for X_days after that time they can withdraw their tokens, also if user participated in voting and it did not end he cannot withdraw his deposit. Every week users are rewarded with 3% of their deposit. They can withdraw the award at any time. The reward is credited in XXXToken.

X_days is set only with DAO voting.

### Description of the DAO
In order to participate in DAO voting user must make a deposit in the stacking. The weight in the voting depends on the deposit in the stacking (For example: deposited 100 LP in the stacking, taking part in the voting have the weight of 100 votes).


### Description of the ACDMPlatform
There are 2 rounds, "Trading" and "Selling," which follow each other, starting with the selling round.

Each round lasts three days.

#### Basic concepts:
Sale round - In this round, the user can buy ACDM tokens at a fixed price from the platform for ETH.
Round "Trade" - in this round, users can redeem ACDM tokens from each other for ETH.
Referral program - the referral program has two levels, users receive revards in ETH.

#### Sale Round Description:
The price of a token grows with each round and is calculated by the formula (see excel file). The number of issued tokens in each Sale round is different and depends on the total volume of trades in the Trade round. The round can end early if all the tokens have been sold out. At the end of the round the unsold tokens are burned. The very first round sells tokens worth 1ETH (100,000 ACDM)

#### Example calculation:
Trading volume in a trade round = 0.5 ETH (the total amount of ETH that users traded in one trade round)

0,5/0,0000187 = 26737.96. (0.0000187 = price of token in current round)

Therefore, in the Sale round will be available for sale 26737.96 tokens ACDM.

#### Description of the Trade Round:
user_1 places an order to sell ACDM tokens for a certain amount of ETH. User_2 redeems the tokens for ETH. The order may not be redeemed in full. The order can also be canceled and the user will receive back his tokens which have not yet been sold. ETH received are immediately sent to the user in their metamask wallet. At the end of the round, all open orders go to the next TRADE round.

#### Referral Program Description:
When registering, the user indicates his referrer (Referrer must already be registered on the platform).

When you buy ACDM tokens in the Sale round, referrer_1 will be sent 5% (this parameter is regulated by DAO) of his purchase, referrer_2 will be sent 3% (this parameter is regulated by DAO), the platform itself will get 92%, in the absence of referrers all get platform.

When buying in Trade round user who put an order to sell ACDM tokens will receive 95% of ETH and 2.5% (this parameter is regulated through DAO) will receive referrers, in their absence, the platform takes these percentages to a special account, which can only be accessed through DAO voting. 

Price ETH = lastPrice*1,03+0,000004

Example calculation: 0.0000100*1.03+0.000004 = 0.0000143

#### Sale Rounds:

* 1 = 0,0000100 ETH
* 2 = 0,0000143 ETH
* 3 = 0,0000187 ETH
* 4 = 0,0000233 ETH
* 5 = 0,0000280 ETH
* 6 = 0,0000328 ETH


#### Through the FAO voting, users will decide to give this commission to the ovner or use it to buy XXXToken on uniswap and then burn them.
* Write all the smart contracts
* Write full-fledged tests for the whole system 
* Write Deployment scripts
* Deploy into the test network
* Write a tasking on the main methods
* To verify the contracts
