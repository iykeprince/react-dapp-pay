
// SPDX-License-Identifier: MIT

pragma solidity 0.7.0;

struct ERC20ForwardRequest {
  address from;
  address to;
  address token;
  uint256 txGas;
  uint256 tokenGasPrice;
  uint256 batchId;
  uint256 batchNonce;
  uint256 deadline;
  bytes data;
}