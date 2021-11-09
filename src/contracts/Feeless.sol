// SPDX-License-Identifier: MIT

pragma solidity 0.7.0;

import { ECRecovery } from "./libraries/ECRecovery.sol";


contract Feeless {
    
    address internal msgSender;
    mapping(address => uint256) public nonces;
    
    modifier feeless {
        if (msgSender == address(0)) {
            msgSender = msg.sender;
            _;
            msgSender = address(0);
        } else {
            _;
        }
    }

    function performFeelessTransaction(address sender, address target, bytes memory data, uint256 nonce, bytes memory sig) public payable {
        require(address(this) == target);
        
        // bytes memory prefix = "";
        bytes32 hash = keccak256(abi.encodePacked(target, data, nonce));
        //  bytes32 hash = keccak256(prefix, keccak256(abi.encodePacked(target, data, nonce)));
        msgSender = ECRecovery.recover(hash, sig);
        require(msgSender == sender);
        require(nonces[msgSender]++ == nonce);
        
                (bool success,  ) = target.call{value: msg.value}(data);

        require(success);
        msgSender = address(0);
    }
    
}