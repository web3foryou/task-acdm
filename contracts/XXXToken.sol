//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract XXXToken is ERC20, AccessControl{
    uint8 private _decimals;

    constructor(string memory name_, string memory symbol_, uint amount, uint8 decimals_) ERC20(name_, symbol_) {
        _decimals = decimals_;
        _mint(msg.sender, amount);
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function decimals() public view override returns (uint8) {
        return _decimals;
    }

    function addMember(address addr) public onlyMember{
        _setupRole(DEFAULT_ADMIN_ROLE, addr);
    }

    function mint(address account, uint256 amount) public onlyMember {
        _mint(account, amount);
    }

    modifier onlyMember() {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "Restricted to members.");
        _;
    }
}
