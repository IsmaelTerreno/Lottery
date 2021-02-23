// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;
import "@openzeppelin/contracts/math/SafeMath.sol";

contract Lottery {
    enum LOTTERY_STATE { OPEN, CLOSED, CALCULATING_WINNER }
    LOTTERY_STATE public lottery_state;
    address payable[] public players;
    address payable private owner_beneficiary;
    uint256 public lotteryId;
    uint256 public ENTER_PRICE;
    uint256 public percentageLessPriceResult; 
    using SafeMath for uint256;

    struct  CheckpointWinner {
        uint256 value;
        uint128 fromBlock;
        address winner;
    }

    event NewWinnerAdded(uint128 fromBlock, address owner, uint amount);
    event LotteryHasEnded();
    event CalculatingWinner();

    CheckpointWinner[] winnersHistory;

    constructor(address _owner_beneficiary, uint256 enter_price) public {
        owner_beneficiary = payable(address(_owner_beneficiary));
        lotteryId = 0;
        lottery_state = LOTTERY_STATE.CLOSED;  
        ENTER_PRICE = enter_price;
        percentageLessPriceResult = uint256(20);
    }
    
    function start_new_lottery() external {
        require(lottery_state == LOTTERY_STATE.CLOSED, "Can't start a new lottery yet");
        lottery_state = LOTTERY_STATE.OPEN;
    }

    function enter() external payable {
        require(uint256(msg.value) == ENTER_PRICE, "The price to enter is not correct.");
        require(lottery_state == LOTTERY_STATE.OPEN, "The lottery hasn't even started!");
        players.push(msg.sender);
    } 
    
    function pickWinner() external {
        require(lottery_state == LOTTERY_STATE.OPEN, "The lottery hasn't even started!");
        lottery_state = LOTTERY_STATE.CALCULATING_WINNER;
        emit CalculatingWinner();
        require(lottery_state == LOTTERY_STATE.CALCULATING_WINNER, "Is already calculating the winner.");
        lotteryId = getRandomWinner();
        payable(owner_beneficiary).transfer(calculateBenefitResult());
        updateWinnerHistory(players[lotteryId], getBalance());
        players[lotteryId].transfer(getBalance());
        lottery_state = LOTTERY_STATE.CLOSED;
        emit LotteryHasEnded();
    }

    function getLastWinner() external view returns(uint128, address, uint256){
        CheckpointWinner memory winner = winnersHistory[winnersHistory.length - 1];
        return (winner.fromBlock, winner.winner, winner.value);
    }

    function updateWinnerHistory(address _address, uint256 amount) private {
        winnersHistory.push(CheckpointWinner(
            {
                fromBlock: uint128(block.number),
                value: amount,
                winner: _address
            }
        ));
        emit NewWinnerAdded(uint128(block.number), _address, amount);
    }

    function getMainBalance() external view returns (uint){
        return address(this).balance;
    }

    function getStatus() external view returns (LOTTERY_STATE){
        return lottery_state;
    }

    function getRandomWinner() private pure returns (uint256) {
        return 1;
    }

    function calculateBenefitResult() private view returns(uint256) {
        return getPercentageValueOf(percentageLessPriceResult, getBalance());
    }

    function getPercentageValueOf(uint256 _percentageNumber, uint256 _totalNumber) private pure returns(uint256){
        uint256 result = _totalNumber.mul(_percentageNumber);
        return result.div(uint256(100)) ;
    }

    function getBalance() private view returns (uint256){
        return address(this).balance;
    }

}