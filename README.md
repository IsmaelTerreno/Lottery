# Lottery
## General description 
This smart contract is a lottery contract that allows players to enter by sending a specific amount of ether to the contract. The lottery can be started by the owner or a user with the proper role and has a defined start and end date. After the lottery ends, the contract randomly selects a winner from the players who entered and transfers the prize to the winner. The contract also keeps a record of the past winners and their respective prizes. Additionally, the contract provides functions to get the current status of the lottery, the current balance of the contract, and the number of positions entered by a specific player within a specific date range. The contract also allows the owner to add or remove lottery workers with proper roles.


## Extended details about public functions
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


**NOTE**: This is just a POC to use solidity smart contract demo

## Dapp that uses this smart contract
[This can be found on this repository](https://github.com/IsmaelTerreno/Lottery-UI) where you can see a reactjs app that consumes this contract.
Also there is a [live demo on this Dapp here](https://github.com/IsmaelTerreno/Lottery-UI/deployments/activity_log?environment=Production).

## License
This project is licensed under the terms of the MIT license. [See the LICENSE file for details](https://opensource.org/licenses/MIT).

## Open Source Software Notice Warranty Disclaimer
This software is provided "AS IS" and any express or implied warranties, including, but not limited to, the implied warranties of merchantability and fitness for a particular purpose are disclaimed. In no event shall the author be liable for any direct, indirect, incidental, special, exemplary, or consequential damages (including, but not limited to, procurement of substitute goods or services; loss of use, data, or profits; or business interruption) however caused and on any theory of liability, whether in contract, strict liability, or tort (including negligence or otherwise) arising in any way out of the use of this software, even if advised of the possibility of such damage.
