// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Mock Escrow Contract for 0G Chain
contract Escrow {
    address public employer;
    address public worker;
    uint256 public amount;
    
    constructor(address _worker) payable {
        employer = msg.sender;
        worker = _worker;
        amount = msg.value;
    }
    
    function release() public {
        require(msg.sender == employer, "Only employer can release");
        payable(worker).transfer(amount);
    }
}
