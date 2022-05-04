//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
contract LpToken is ERC20{
    uint8 private _decimals;

    constructor(string memory name_, string memory symbol_, uint amount, uint8 decimals_) ERC20(name_, symbol_) {
        _decimals = decimals_;
        _mint(msg.sender, amount);
    }

    function decimals() public view override returns (uint8) {
        return _decimals;
    }

}
