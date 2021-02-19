// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract FAssetToken is ERC20 {
    constructor(address owner) public ERC20("FAsset", "FAS") {
        _mint(owner, 1_000_000_000e18);
    }
}
