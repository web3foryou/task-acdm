//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "hardhat/console.sol";
import "./ACDMToken.sol";
import "./XXXToken.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";

contract ACDMPlatform {

    bool public roundSale; // true - Sale, false - Trade
    address private _acdmToken;
    address public owner;
    uint public roundTime;
    uint public startTimeLastRound;
    uint public roundNum; // текущий sale или trade раунд
    uint public numTokenSale; // число токенов для продажи
    uint public lastPrice; // цена токена 18 разрядная

    mapping(address => bool) private _users;
    // 0x00000000000000000000000000000000000000000000000000 - Значит нет овнера у реферала
    mapping(address => address) private _referrals; // referral => owner

    mapping(uint => Order) public orders;

    uint public lastOrder;

    uint tradeAmountTokens;
    uint tradeAmountEth;

    struct Order {
        address owner;
        uint amount; // если это значение 0, то значит ордер либо выкуплен, либо не активен более
        uint price;
    }

    constructor(address acdmToken_, uint roundTime_) {
        owner = msg.sender;
        _acdmToken = acdmToken_;
        roundTime = roundTime_;
    }

    fallback() external payable {}

    function register(address refOwner) public {
        require(_users[msg.sender] == false, "Already registered");

        _users[msg.sender] = true;

        if (_users[refOwner] && refOwner != address(0x00000000000000000000000000000000000000000000000000)) {
            _referrals[msg.sender] = refOwner;
        }
    }

    function getOwnerRef(address ref) view public returns (address){
        return _referrals[ref];
    }

    function nextRound() public {
        // если идет сейл раунд
        if (roundSale) {
            if (numTokenSale != 0) {
                require(startTimeLastRound + roundTime <= block.timestamp, "Sale round not over.");
                ACDMToken(_acdmToken).burn(numTokenSale);
            }
            roundSale = false;
            startTimeLastRound = block.timestamp;
            tradeAmountTokens = 0;
            tradeAmountEth = 0;

            // если идет трейд раунд
        } else {
            require(startTimeLastRound + roundTime <= block.timestamp, "Trade round not over.");

            if (roundNum == 0) {
                roundNum = 1;
                numTokenSale = 100000 * 10 ** 6;
                lastPrice = 10 ** 18 / numTokenSale;
            } else {
                roundNum++;

                lastPrice = lastPrice * 103 / 100 + 4 * 10 ** 6;
                numTokenSale = tradeAmountEth / lastPrice;
            }

            roundSale = true;
            startTimeLastRound = block.timestamp;
        }
    }

    function buyTokens() public payable {
        uint amount = msg.value / lastPrice;

        require(roundSale, "Trade round");
        require(numTokenSale >= amount, "No tokens for sale.");

        numTokenSale -= amount;

        address referral1 = getOwnerRef(msg.sender);
        if (referral1 != address(0x00000000000000000000000000000000000000000000000000)) {
            uint refAmount1 = amount * 5 / 100;
            address referral2 = getOwnerRef(referral1);
            referral1.call{value : refAmount1}("");

            if (referral2 != address(0x00000000000000000000000000000000000000000000000000)) {
                uint refAmount2 = amount * 3 / 100;
                referral2.call{value : refAmount2}("");
            }
        }

        SafeERC20.safeTransfer(
            ACDMToken(_acdmToken),
            msg.sender,
            amount
        );
    }

    function makeOrder(uint amount, uint price) public {
        require(!roundSale, "Sale round");
        require(ACDMToken(_acdmToken).allowance(msg.sender, address(this)) >= amount, "Don't allowance.");
        require(amount != 0, "Amount = 0");
        require(price != 0, "Price = 0");

        SafeERC20.safeTransferFrom(
            ACDMToken(_acdmToken),
            msg.sender,
            address(this),
            amount
        );

        lastOrder++;
        orders[lastOrder].owner = msg.sender;
        orders[lastOrder].price = price;
        orders[lastOrder].amount = amount;
    }

    function buyOrder(uint orderId) public payable {
        require(!roundSale, "Sale round");
        require(orderId <= lastOrder, "Don't exist this order.");
        require(orders[orderId].amount != 0, "The order is not available.");
        require(msg.value <= orders[orderId].price, "Over Price.");

        uint amount;
        if (msg.value == orders[orderId].price) {
            amount = orders[orderId].amount;
        } else {
            uint prc = 100 * msg.value / orders[orderId].price;
            amount = orders[orderId].amount * prc / 100;
            orders[orderId].price -= msg.value;
        }

        address referral1 = getOwnerRef(orders[orderId].owner);
        if (referral1 != address(0x00000000000000000000000000000000000000000000000000)) {
            uint refAmount = amount * 25 / 1000;
            address referral2 = getOwnerRef(referral1);
            referral1.call{value : refAmount}("");

            if (referral2 != address(0x00000000000000000000000000000000000000000000000000)) {
                referral2.call{value : refAmount}("");
            }
        }

        orders[orderId].amount -= amount;

        tradeAmountEth += msg.value;
        tradeAmountTokens += amount;

        SafeERC20.safeTransfer(
            ACDMToken(_acdmToken),
            msg.sender,
            amount
        );

        orders[orderId].owner.call{value : msg.value}("");
    }

    function closeOrder(uint orderId) public {
        require(orderId <= lastOrder, "Don't exist this order.");
        require(msg.sender == orders[orderId].owner, "Not the owner.");
        require(orders[orderId].amount != 0, "The order is not available.");

        uint amount = orders[orderId].amount;

        orders[orderId].amount = 0;

        SafeERC20.safeTransfer(
            ACDMToken(_acdmToken),
            msg.sender,
            amount
        );
    }

    function buyAndBurn(address router, address weth, address xxx) public {
        address[] memory addr = new address[](2);
        addr[0] = weth;
        addr[1] = xxx;

        IUniswapV2Router02(router).swapExactETHForTokens{value : (payable(address(this))).balance}(0, addr, address(this), 2 ** 200);
        XXXToken(xxx).burn(XXXToken(xxx).balanceOf(address(this)));
    }

    function sendEthToOwner() public {
        owner.call{value : (payable(address(this))).balance}("");
    }
}
