//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "hardhat/console.sol";
import "./LpToken.sol";
import "./Staking.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract Dao {
    address  private _chairPerson;
    address private _staking;
    uint private _minQuorum;
    uint private _minPeriod;
    mapping(uint => Item) private _proposals;
    uint public lastProposal;

    struct Item {
        bool statusFinish;
        address[] recipients;
        uint startTime;
        uint voteFor;
        uint voteAgainsts;
        bytes[] callData;
        string description;
        mapping(address => uint) voters;
    }

    constructor(address chairPerson, uint _minimumQuorum, uint minPeriod, address staking) {
        _chairPerson = chairPerson;
        _minQuorum = _minimumQuorum;
        _minPeriod = minPeriod;
        _staking = staking;
    }

    fallback() external payable {}

    function addProposal(bytes[] memory callData, address[] memory recipients, string memory description) public {
        require(msg.sender == _chairPerson, "Not chairperson.");

        lastProposal++;
        _proposals[lastProposal].startTime = block.timestamp;
        _proposals[lastProposal].callData = callData;
        _proposals[lastProposal].recipients = recipients;
        _proposals[lastProposal].description = description;
    }

    function vote(uint id, bool voteFor) public {
        uint deposit = Staking(_staking).balanceOf(msg.sender);
        require(deposit > 0, "Don't have deposit");
        require(_proposals[id].voters[msg.sender] == 0, "Already voted.");

        if (voteFor) {
            _proposals[id].voteFor += deposit;
        } else {
            _proposals[id].voteAgainsts += deposit;
        }

        _proposals[id].voters[msg.sender] += deposit;
    }

    function finishProposal(uint id) public {
        require(_proposals[id].startTime > 0, "Not have proposale.");
        require(_proposals[id].statusFinish == false, "Already finished.");
        require(block.timestamp >= _proposals[id].startTime + _minPeriod, "Little time.");
        require(_proposals[id].voteFor + _proposals[id].voteAgainsts >= _minQuorum, "Few votes.");

        _proposals[id].statusFinish = true;

        if (_proposals[id].voteFor > _proposals[id].voteAgainsts) {
            for (uint i = 0; i < _proposals[id].callData.length; i++) {
                _proposals[id].recipients[i].call(_proposals[id].callData[i]);
            }
        }
    }

    function checkForUnstake(address _addr) public view returns (bool){
        for (uint i = 1; i <= lastProposal; i++) {
            if (_proposals[i].statusFinish) {
                continue;
            }

            if (_proposals[i].voters[_addr] > 0) {
                return false;
            }
        }
        return true;
    }

    function test(bytes memory callData, address addr) public {
        addr.call(callData);
    }
}
