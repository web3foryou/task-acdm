//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "hardhat/console.sol";

contract Test {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    function test(bytes memory callData, address addr) public {
        addr.call(callData);
    }
}
