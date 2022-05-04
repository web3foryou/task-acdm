//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "hardhat/console.sol";
import "./LpToken.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract Dao {
    address  private _chairPerson;
    address private _voteToken;
    uint private _minQuorum;
    uint private _minPeriod;
    mapping(address => uint) private deposits;
    mapping(uint => Item) private _proposals;
    uint public lastProposal = 0;

    struct Item {
        bool statusFinish;
        address recipient;
        uint startTime;
        uint voteFor;
        uint voteAgainsts;
        bytes callData;
        string description;
        mapping(address => uint) voters;
    }

    constructor(address chairPerson, address voteToken, uint _minimumQuorum, uint minPeriod) {
        _chairPerson = chairPerson;
        _voteToken = voteToken;
        _minQuorum = _minimumQuorum;
        _minPeriod = minPeriod;
    }

    function deposit(uint amount) public {
        require(LpToken(_voteToken).allowance(msg.sender, address(this)) >= amount, "Don't allowance tokens.");

        SafeERC20.safeTransferFrom(
            LpToken(_voteToken),
            msg.sender,
            address(this),
            amount
        );

        deposits[msg.sender] += amount;
    }

    function addProposal(bytes memory callData, address recipient, string memory description) public {
        require(msg.sender == _chairPerson, "Not chairperson.");

        lastProposal++;
        _proposals[lastProposal].startTime = block.timestamp;
        _proposals[lastProposal].callData = callData;
        _proposals[lastProposal].recipient = recipient;
        _proposals[lastProposal].description = description;
    }

    function vote(uint id, bool voteFor) public {
        require(deposits[msg.sender] > 0, "Don't have deposit");
        require(_proposals[id].voters[msg.sender] == 0, "Already voted.");

        if (voteFor) {
            _proposals[id].voteFor += deposits[msg.sender];
        } else {
            _proposals[id].voteAgainsts += deposits[msg.sender];
        }

        _proposals[id].voters[msg.sender] += deposits[msg.sender];
    }

    function finishProposal(uint id) public {
        require(_proposals[id].startTime > 0, "Not have proposale.");
        require(_proposals[id].statusFinish == false, "Already finished.");
        require(block.timestamp >= _proposals[id].startTime + _minPeriod, "Little time.");
        require(_proposals[id].voteFor + _proposals[id].voteAgainsts >= _minQuorum, "Few votes.");

        _proposals[id].statusFinish = true;

        if (_proposals[id].voteFor > _proposals[id].voteAgainsts) {
            _proposals[id].recipient.call(_proposals[id].callData);
        }
    }

    function getTokens() public {
        require(deposits[msg.sender] > 0, "Don't have tokens.");

        for (uint i = 1; i <= lastProposal; i++) {
            if (_proposals[i].statusFinish) {
                continue;
            }

            require(_proposals[i].voters[msg.sender] == 0, "Existing open offer.");
        }

        uint amount = deposits[msg.sender];

        deposits[msg.sender] = 0;

        SafeERC20.safeTransfer(
            LpToken(_voteToken),
            msg.sender,
            amount
        );
    }


}
