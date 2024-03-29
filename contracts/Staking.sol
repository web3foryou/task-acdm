//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./Dao.sol";

import "hardhat/console.sol";

contract Staking is AccessControl {
    address public lpToken;
    address public rewardToken;
    address payable public dao;

    mapping(address => uint) private _balances;
    mapping(address => uint) private _timeStake;
    mapping(address => uint) private _rewards;

    uint public lockTime;
    uint public timeReward;
    uint public prcReward;

    string public name;

    event Response(bool success, bytes data);

    constructor(string memory _name, address _lpToken, address _rewardToken) {
        name = _name;
        lpToken = _lpToken;
        rewardToken = _rewardToken;
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        lockTime = 3 * 24 * 60 * 60;
        timeReward = 24 * 60 * 60;
        prcReward = 3;
    }

    function stake(uint amount) public {
        require(IERC20(lpToken).allowance(msg.sender, address(this)) >= amount, "No amount stake");

        SafeERC20.safeTransferFrom(IERC20(lpToken), msg.sender, address(this), amount);

        uint rewardsCount = (block.timestamp - _timeStake[msg.sender]) / timeReward;

        if (rewardsCount > 0) {
            _rewards[msg.sender] += rewardsCount * _balances[msg.sender] * prcReward / 100;
        }

        _balances[msg.sender] += amount;

        _timeStake[msg.sender] = block.timestamp;
    }


    function balanceOf(address _addr) public view returns (uint){
        return _balances[_addr];
    }

    function claim() public {
        require(_timeStake[msg.sender] + timeReward <= block.timestamp, "Time error.");
        require(_balances[msg.sender] > 0, "Zero balance.");

        uint rewardsCount = (block.timestamp - _timeStake[msg.sender]) / timeReward;

        uint amountReward = _rewards[msg.sender] + rewardsCount * _balances[msg.sender] * prcReward / 100;

        _rewards[msg.sender] = 0;

        _timeStake[msg.sender] += rewardsCount * timeReward;

        SafeERC20.safeTransfer(IERC20(rewardToken), msg.sender, amountReward);
    }

    function unstake() public {
        require(_balances[msg.sender] > 0, "No amount unstake");
        require(_timeStake[msg.sender] + lockTime <= block.timestamp, "Time error.");
        require(Dao(dao).checkForUnstake(msg.sender), "You have an open vote.");

        uint amount = _balances[msg.sender];
        _balances[msg.sender] = 0;
        SafeERC20.safeTransfer(IERC20(lpToken), msg.sender, amount);
    }


    function changeLockTime(uint _time) public onlyMember {
        lockTime = _time;
    }

    function changeTimeReward(uint _time) public onlyMember {
        timeReward = _time;
    }

    function changePrcReward(uint _prcReward) public onlyMember {
        prcReward = _prcReward;
    }

    function setDao(address payable _addr) public onlyMember {
        dao = _addr;
    }

    function addMember(address _addr) public onlyMember {
        _setupRole(DEFAULT_ADMIN_ROLE, _addr);
    }

    modifier onlyMember() {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "Restricted to members.");
        _;
    }
}
