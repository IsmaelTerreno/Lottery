# Lottery
Just a POC to use solidity smart contract demo

This is a smart contract called "Lottery" that manages a lottery system where users can enter by sending the correct amount of ether to the contract. The contract has the following functionality:
The contract has: 
- A state variable called "lottery_state" which is an enum that can have three possible values: "OPEN", "CLOSED", and "CALCULATING_WINNER". This variable determines the state of the lottery and is used to prevent certain actions from being taken during certain states.
- Has an array of address payable called "players" that holds the addresses of users who have entered the lottery.
- Has a struct called "CheckpointLotteryPlayer" that holds the information of each player in the lottery. This struct contains the value of the player's entry, the block number at which the player entered, the player's address, the start date of the lottery, and the end date of the lottery.
- Has an array of "CheckpointLotteryPlayer" called "lottery_players" that holds the information of all players in the lottery.
- Has a struct called "CheckpointWinner" that holds the information of each winner in the lottery. This struct contains the value of the winnings, the block number at which the winner was selected, the start date of the lottery, the end date of the lottery, and the winner's address.
- Has an array of "CheckpointWinner" called "winnersHistory" that holds the information of all winners in the lottery.
- Has an address payable variable called "owner_beneficiary" that holds the address of the owner of the contract who will receive a percentage of the winnings.
- Has a uint256 variable called "startDate" that holds the start date of the lottery.
- Has a uint256 variable called "endDate" that holds the end date of the lottery.
- Has a uint256 variable called "lotteryId" that holds the index of the winning player in the "lottery_players" array.
- Has a uint256 variable called "ENTER_PRICE" that holds the entry price for the lottery.
- Has a uint256 variable called "percentageLessPriceResult" that holds the percentage of the winnings that will go to the owner of the contract.
- Has a bytes32 constant variable called "LOTTERY_ROLE" that holds a keccak256 hash of the string "LOTTERY_ROLE". This variable is used to manage access to certain functions in the contract.
- Uses the SafeMath library from OpenZeppelin to perform mathematical operations securely.
- Inherits from the "Ownable" and "AccessControl" contracts from OpenZeppelin. The "Ownable" contract provides basic access control with an owner who can approve certain actions. The "AccessControl" contract allows for more fine-grained access control with roles that can be assigned to users.
- Has several events that are emitted during various actions. These events include "NewPlayerTicketAdded", "NewWinnerAdded", "LotteryHasEnded", "CalculatingWinner", "LotteryHasStarted", and "WinnerSelectedInDate". These events provide information about the actions taken in the contract and can be used for off-chain analysis.
- Has several functions for managing the lottery. These functions include "start_new_lottery", "start_new_lottery_with", "add_lottery_worker", "isLotteryAdmin", "enter", "pickWinner", "pick_winner_with", "getLastWinner", "getLast40Winners", "getWinnerAtBlock", "getPlayersFromToDate", "getPlayersFromToDateCount", "getMainBalance", "getStatus", "getRandomWinner", "updateWinnerHistory", "calculateBenefitResult"
