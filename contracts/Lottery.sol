// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;
import "@openzeppelin/contracts/math/SafeMath.sol";

contract Lottery {
    enum LOTTERY_STATE { OPEN, CLOSED, CALCULATING_WINNER }
    LOTTERY_STATE public lottery_state;
    address payable[] public players;
    CheckpointLotteryPlayer[] public lotery_players;
    address payable private owner_beneficiary;
    uint256 startDate;
    uint256 endDate; 
    uint256 public lotteryId;
    uint256 public ENTER_PRICE;
    uint256 public percentageLessPriceResult; 
    using SafeMath for uint256;

    struct  CheckpointWinner {
        uint256 value;
        uint256 startDate;
        uint256 endDate; 
        uint128 fromBlock;
        address winner;
        
    }

    struct CheckpointLotteryPlayer {
        uint256 value;
        uint256 startDate;
        uint256 endDate; 
        uint128 fromBlock;
        address player;
    }
    event NewWinnerAdded(uint128 fromBlock, address owner, uint amount);
    event LotteryHasEnded(uint256 endDate);
    event CalculatingWinner( uint256 startDate, uint256 endDate);
    event LotteryHasStarted(uint256 enter_price, uint256 startDate, uint256 endDate);
    event WinnerSelectedInDate(address winner, uint256 amount, uint256 startDate, uint256 endDate);
    event PlayersFoundInRangeDate( uint256 resultCount, uint256 _startDate,  uint256 _endDate);
    event DebugPlayer( uint256 resultCount);
    CheckpointWinner[] winnersHistory;

    constructor(address _owner_beneficiary, uint256 enter_price) public {
        owner_beneficiary = payable(address(_owner_beneficiary));
        lotteryId = 0;
        lottery_state = LOTTERY_STATE.CLOSED;  
        ENTER_PRICE = enter_price;
        percentageLessPriceResult = uint256(20);
    }
    
    function start_new_lottery(uint256 _startDate, uint256 _endDate) external {
        require(lottery_state == LOTTERY_STATE.CLOSED, "Can't start a new lottery yet");
        lottery_state = LOTTERY_STATE.OPEN;
        startDate = _startDate;
        endDate = _endDate; 
        emit LotteryHasStarted(ENTER_PRICE, startDate, endDate);
    }

    function enter() external payable {
        require(uint256(msg.value) == ENTER_PRICE, "The price to enter is not correct.");
        require(lottery_state == LOTTERY_STATE.OPEN, "The lottery hasn't even started!");
        players.push(msg.sender);
        lotery_players.push(CheckpointLotteryPlayer({
            value: uint256(msg.value),
            fromBlock: uint128(block.number),
            player: msg.sender,
            startDate: startDate,
            endDate: endDate
        }));
    } 
    
    function pickWinner(uint _saltRandomNumber) external {
        require(lottery_state == LOTTERY_STATE.OPEN, "The lottery hasn't even started!");
        require(lottery_state != LOTTERY_STATE.CALCULATING_WINNER, "Is already calculating the winner.");
        lottery_state = LOTTERY_STATE.CALCULATING_WINNER;
        emit CalculatingWinner( startDate, endDate);
        CheckpointLotteryPlayer[] memory playersFounded = getPlayersFromToDate( startDate, endDate);
        lotteryId = getRandomWinner(playersFounded.length - 1, _saltRandomNumber);
        CheckpointLotteryPlayer memory winnerSelected = playersFounded[lotteryId];
        payable(owner_beneficiary).transfer(calculateBenefitResult());
        updateWinnerHistory(winnerSelected.player, getBalance());
        emit WinnerSelectedInDate(winnerSelected.player, getBalance(), startDate, endDate);
        payable(winnerSelected.player).transfer(getBalance());
        lottery_state = LOTTERY_STATE.CLOSED;
        emit LotteryHasEnded(endDate);
    }

    function getLastWinner() external view returns( bool, uint128, address, uint256){
        if(winnersHistory.length > 0){
            CheckpointWinner memory winner = winnersHistory[winnersHistory.length - 1];
            return (true, winner.fromBlock, winner.winner, winner.value);
        }
        return(false, uint128(0), address(0),uint256(0));
    }

    function getWinnerAtBlock(uint128 _fromBlock) external view returns(bool,uint128, address, uint256){
        for(uint i = 0; i<winnersHistory.length; i++){
            if(winnersHistory[i].fromBlock == _fromBlock){
                return (true,winnersHistory[i].fromBlock, winnersHistory[i].winner, winnersHistory[i].value);
            }
        }
        return(false, uint128(0), address(0),uint256(0));
    }

    function getPlayersFromToDate( uint256 _startDate, uint256 _endDate) private returns(CheckpointLotteryPlayer[] memory){
        CheckpointLotteryPlayer[] memory playersFound =  new CheckpointLotteryPlayer[](getPlayersFromToDateCount(
            _startDate, 
            _endDate 
        ));
        uint j = 0;
        for(uint i = 0; i < lotery_players.length; i++) {
            if(lotery_players[i].startDate >= _startDate && lotery_players[i].endDate <= _endDate){
                playersFound[j] = lotery_players[i];
                j++;
            }
        }
        return playersFound;
    }

    function getPlayersFromToDateCount( uint256 _startDate, uint256 _endDate) private returns(uint256){
        uint256 resultCount = 0;
        for(uint i = 0; i < lotery_players.length; i++){
            if(lotery_players[i].startDate >= _startDate && lotery_players[i].endDate <= _endDate){
                resultCount++;
            }
        }
        emit PlayersFoundInRangeDate( resultCount, _startDate,  _endDate);
        return resultCount;
    }

    function getMainBalance() external view returns (uint){
        return address(this).balance;
    }

    function getStatus() external view returns (LOTTERY_STATE){
        return lottery_state;
    }

    // TODO: Use Chainlink VRF to generate real random nubers, on this implementation is solydity but needs to go Chainlink VRF some day is just a suggestion.
    function getRandomWinner(uint _modulus, uint randNonce) private view returns (uint256) {
        return uint256(keccak256(abi.encodePacked(block.timestamp,  
                                          msg.sender,  
                                          randNonce))) % _modulus;
    }

    function updateWinnerHistory(address _address, uint256 _amount) private {
        winnersHistory.push(CheckpointWinner(
            {
                fromBlock: uint128(block.number - 1),
                value: _amount,
                winner: _address,
                startDate: startDate,
                endDate: endDate
            }
        ));
        emit NewWinnerAdded(uint128(block.number - 1), _address, _amount);
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