// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;
import "@openzeppelin/contracts/math/SafeMath.sol";

contract Lottery {
    enum LOTTERY_STATE { OPEN, CLOSED, CALCULATING_WINNER }
    LOTTERY_STATE public lottery_state;
    address payable[] public players;
    address payable private constant owner_beneficiary = 0xd37D094E65df5FC609e472561DDcc1455a376D10;
    uint256 public lotteryId;
    uint256 public ENTER_PRICE;
    uint256 public percentageLessPriceResult; 
    using SafeMath for uint256;

    constructor() public {
        lotteryId = 0;
        lottery_state = LOTTERY_STATE.CLOSED;  
        ENTER_PRICE = 1 ether;
        percentageLessPriceResult = uint256(20);
    }
    
    function start_new_lottery() external {
        require(lottery_state == LOTTERY_STATE.CLOSED, "can't start a new lottery yet");
        lottery_state = LOTTERY_STATE.OPEN;
    }

    function enter() external payable {
        require(msg.value == ENTER_PRICE, "The price to enter is not correct.");
        //assert(lottery_state == LOTTERY_STATE.OPEN);
        players.push(msg.sender);
    } 
    
    function pickWinner() external {
        require(lottery_state == LOTTERY_STATE.OPEN, "The lottery hasn't even started!");
        lottery_state = LOTTERY_STATE.CALCULATING_WINNER;
        lotteryId = 1;
        // require(lottery_state == LOTTERY_STATE.CALCULATING_WINNER, "You aren't at that stage yet!");
        payable(owner_beneficiary).transfer(calculateBenefitResult());
        players[lotteryId].transfer(getBalance());
        lottery_state = LOTTERY_STATE.CLOSED;
    }

    function calculateBenefitResult() private view returns(uint256) {
        return getPercentageValueOf(percentageLessPriceResult, getBalance());
    }

    function getPercentageValueOf(uint256 _percentageNumber, uint256 _totalNumber) private pure returns(uint256){
        uint256 result = _totalNumber.mul(_percentageNumber);
        return result.div(uint256(100)) ;
    }

    function getBalance() public view returns (uint256){
        return address(this).balance;
    }
}