// SPDX-License-Identifier: MIT

pragma solidity 0.7.0;
import "./libraries/SafeMath.sol";
import "./libraries/SafeERC20.sol";
import "./libraries/Address.sol";
import "./libraries/Ownable.sol";
import "./interfaces/IERC20.sol";

//My test library for feeless transactions
// import "./Feeless.sol";

contract Payment is Ownable  {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;
    
    //event to notify the backend/frontend that a transaction has occured
    event DepositReceived(address indexed from, bytes32 indexed txRef, uint256 amount); 
    event PaymentWithdrawn(address indexed from, address indexed tokenContract, uint256 amount); 

    event CurrencyEnabled(address indexed tokenContract);
    event CurrencyDisabled(address indexed tokenContract);


    mapping(address=> bool) _acceptedCurrencies;
    
    constructor(address tokenContract)  
    {
        _acceptedCurrencies[tokenContract] = true;
        emit CurrencyEnabled(tokenContract);

    }

    function enableCurrency(address tokenContract) external  onlyOwner
    {
        _acceptedCurrencies[tokenContract] = true;
        emit CurrencyEnabled(tokenContract);
    }

    function disableCurrency(address tokenContract) external onlyOwner
    {
        _acceptedCurrencies[tokenContract] = false;
        emit CurrencyDisabled(tokenContract);
    }

    function isTokenSupported(address tokenContract) internal view returns (bool)
    {   
        return _acceptedCurrencies[tokenContract];
    }
     
    

    function withdraw(address tokenAddress) external onlyOwner {
        IERC20 token = IERC20(tokenAddress);
        uint256 balance = token.balanceOf(address(this));
        token.safeTransfer(_msgSender(), balance);     
        emit PaymentWithdrawn(_msgSender(),tokenAddress,balance) ;
    }

    function deposit(bytes32 txRef, uint256 txAmount, address tokenContract) external returns (bool) {

        require(isTokenSupported(tokenContract), "Payment.Sol: Payment token is unsupported");
        IERC20 token = IERC20(tokenContract);
        uint256 allowance = token.allowance(_msgSender(), address(this));

        require(allowance==txAmount,"Payment.Sol: payment amount does not tally");

        token.safeTransferFrom(_msgSender(),address(this),allowance);
        emit DepositReceived(_msgSender(), txRef, allowance);
        return true;
    }
    
}