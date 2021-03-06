// SPDX-License-Identifier: MIT

pragma solidity 0.7.0;
pragma experimental ABIEncoderV2;


import "./libraries/SafeMath.sol";
import "./libraries/SafeERC20.sol";
import "./libraries/Address.sol";
import "./libraries/Ownable.sol";
import "./interfaces/IERC20.sol";




contract Wallet is Ownable {
    // using SafeMath for uint256;
    // using SafeERC20 for IERC20;
       
    // mapping(string => UserWallet) private _userWallets;

    // address private _paymentCurrency;
    
    // constructor(address tokenContract)  
    // {
    //     _paymentCurrency = tokenContract;
    // }

    // function setWallet(string calldata email, address wallet  ) external
    // {
    //     require(!_userWallets[email].Exists, "Wallet.sol: Account has already been initialized");
    //     _userWallets[email] = UserWallet(wallet, true);
    // }

    // function getWallet(string email) external view returns (UserWallet memory)
    // {
    //     // require(_userWallets[email].Exists, "Wallet.sol: Account not found");

    //     return _userWallets[email];
    // }

    // function getBalance(string email) external view returns (uint256)
    // {
    //     require(_userWallets[email].Exists, "Wallet.sol: Account not found");
    //     IERC20 token  = IERC20(_paymentCurrency);
    //     return token.balanceOf(_userWallet[email].Wallet);
    // }
}

struct UserWallet
{
    address Wallet;
    bool Exists;
}