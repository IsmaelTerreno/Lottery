const Lottery = artifacts.require("Lottery");
const { APP_CONFIG } = require("../truffle-config");
const Chance = require('chance');
const chance = new Chance();

contract("Lottery", async accounts => {
    const LOTTERY_STATE = { OPEN: 0, CLOSED: 1, CALCULATING_WINNER:2 };
    const ENTER_PRICE = web3.utils.toWei(APP_CONFIG.ENTER_PRICE_LOTTERY_IN_ETHER, "ether");
    const CONTRACT_OWNER = APP_CONFIG.CONTRACT_OWNER; 

    xit("should NOT start a new lottery when you are not the contract owner", async () => {
        let instance = await Lottery.deployed();
        const account_one = accounts[0];
        const startDate = new Date();
        const endDate = new Date();
        const numberOfDayToAdd = 1;
        endDate.setDate(endDate.getDate() + numberOfDayToAdd );
        try {
            await instance.start_new_lottery.sendTransaction(startDate.getTime(), endDate.getTime(),{ from: account_one[9] });
        } catch (error) {
            status = await instance.getStatus.call({ from: account_one });
            assert.equal(
                status.toNumber() == LOTTERY_STATE.CLOSED,
                true,
                "Lottery must not be open when you are not the owner."
            );
        }  
    });

    xit("should start a new lottery", async () => {
        let instance = await Lottery.deployed();
        const account_one = accounts[0];
        const startDate = new Date();
        const endDate = new Date();
        const numberOfDayToAdd = 1;
        endDate.setDate(endDate.getDate() + numberOfDayToAdd );
        await instance.start_new_lottery.sendTransaction(startDate.getTime(), endDate.getTime(),{ from: CONTRACT_OWNER });
        status = await instance.getStatus.call({ from: account_one });
        assert.equal(
            status.toNumber() == LOTTERY_STATE.OPEN,
            true,
            "Lottery is not open"
        );
    });

    xit("should store sent value in the contract for a new lotery", async () => {
        let instance = await Lottery.deployed();
        const account_one = accounts[0];
        const account_two = accounts[1];
        let balance_before = await instance.getMainBalance.call({ from: account_one });
        let main_balance_before = web3.utils.fromWei(balance_before.toString(), "ether");
        await instance.enter.sendTransaction({from: account_one, value: ENTER_PRICE });
        await instance.enter.sendTransaction({from: account_two, value: ENTER_PRICE });
        let balance_after = await instance.getMainBalance.call({ from: account_one });
        let main_balance_after = web3.utils.fromWei(balance_after.toString(), "ether");
        assert.equal(
            parseFloat(main_balance_after) > parseFloat(main_balance_before),
            true,
            "Balance is not correct."
        );
    });

    xit(`should pick NOT the winner and deliver EHT when you are not the contract owner`, async () => {
        let instance = await Lottery.deployed();
        const account_one = accounts[0];
        const seed = chance.natural();
        try {
            await instance.pickWinner.sendTransaction(seed, { from: account_one[9]});    
        } catch (error) {
            status = await instance.getStatus.call({ from: account_one });
            assert.equal(
                status.toNumber() != LOTTERY_STATE.CALCULATING_WINNER,
                true,
                "Lottery must not be calculating the winner when you are not the contract owner"
            );
        }
        
    });

    xit(`should pick the winner and deliver EHT to the winner account`, async () => {
        let instance = await Lottery.deployed();
        const account_one = accounts[0];
        const seed = chance.natural();
        await instance.pickWinner.sendTransaction(seed, { from: CONTRACT_OWNER });
        const result = await instance.getLastWinner.call({ from: account_one });
        let isWinnerFound = result[0];
        assert.equal(
            isWinnerFound,
            true,
            "No Winner address found."
        );
        let winner = result[2];
        let value = web3.utils.fromWei(result[3].toString(), "ether");
        assert.equal(
            winner =! '',
            true,
            "Winner address is not correct."
        );
        assert.equal(
            parseFloat(value) > parseFloat(0),
            true,
            "Winner value is not correct."
        );
    });

    xit(`should pick the winner at one particular block in history`, async () => {
        let instance = await Lottery.deployed();
        const account_one = accounts[0];
        const result = await instance.getLastWinner.call({ from: account_one });
        let isWinnerFound = result[0];
        assert.equal(
            isWinnerFound,
            true,
            "No Winner address found."
        );
        let fromBlock = result[1].toNumber();
        const result2 = await instance.getWinnerAtBlock.call(fromBlock , { from: account_one });
        let isFound = result2[0];
        let winnerAtBlock = result2[2];
        let valueAtBlock = web3.utils.fromWei(result2[3].toString(), "ether");
        assert.equal(
            isFound,
            true,
            "Winner not found at block history."
        );
        assert.equal(
            winnerAtBlock =! '',
            true,
            "Winner address is not correct."
        );
        assert.equal(
            parseFloat(valueAtBlock) > parseFloat(0),
            true,
            "Winner value is not correct."
        );
    });

    xit(`should put ${ENTER_PRICE} Wei in the lotery and deliver to the winner account with 4 accounts`, async () => {
        let instance = await Lottery.deployed();
        const account_one = accounts[0];
        const account_two = accounts[1];
        const account_three = accounts[2];
        const account_four = accounts[3];
        const startDate = new Date();
        const endDate = new Date();
        const numberOfDayToAdd = 1;
        endDate.setDate(endDate.getDate() + numberOfDayToAdd );
        await instance.start_new_lottery.sendTransaction(startDate.getTime(), endDate.getTime(),{ from: CONTRACT_OWNER });
        await instance.enter.sendTransaction({from: account_one, value: ENTER_PRICE });
        await instance.enter.sendTransaction({from: account_two, value: ENTER_PRICE });
        await instance.enter.sendTransaction({from: account_three, value: ENTER_PRICE });
        await instance.enter.sendTransaction({from: account_four, value: ENTER_PRICE });
        const seed = chance.natural();
        await instance.pickWinner.sendTransaction(seed, { from: CONTRACT_OWNER });
        const result = await instance.getLastWinner.call({ from: account_one });
        let isWinnerFound = result[0];
        assert.equal(
            isWinnerFound,
            true,
            "No Winner address found."
        );
        let winner = result[2];
        let value = web3.utils.fromWei(result[3].toString(), "ether");
        assert.equal(
            winner =! '',
            true,
            "Winner address is not correct."
        );
        assert.equal(
            parseFloat(value) > parseFloat(0),
            true,
            "Winner value is not correct."
        );
    });

    xit("should NOT start a new lottery when you have not the LOTTERY_ROLE role", async () => {
        let instance = await Lottery.deployed();
        const account_one = accounts[0];
        const startDate = new Date();
        const endDate = new Date();
        const numberOfDayToAdd = 1;
        endDate.setDate(endDate.getDate() + numberOfDayToAdd );
        try {
            await instance.start_new_lottery_with.sendTransaction(startDate.getTime(), endDate.getTime(),{ from: account_one[9] });
        } catch (error) {
            status = await instance.getStatus.call({ from: account_one });
            assert.equal(
                status.toNumber() == LOTTERY_STATE.CLOSED,
                true,
                "Lottery must not be open when you have not the LOTTERY_ROLE role."
            );
        }  
    });

    xit("should start a new lottery when you have the LOTTERY_ROLE role", async () => {
        let instance = await Lottery.deployed();
        const account_one = accounts[0];
        const account_ten = accounts[9];
        const startDate = new Date();
        const endDate = new Date();
        const numberOfDayToAdd = 1;
        endDate.setDate(endDate.getDate() + numberOfDayToAdd );
        await instance.add_lottery_worker.sendTransaction(account_ten,{ from: CONTRACT_OWNER });
        try {
            await instance.start_new_lottery_with.sendTransaction(startDate.getTime(), endDate.getTime(),{ from: account_ten });
        } catch (error) {
            status = await instance.getStatus.call({ from: account_one });
            assert.equal(
                status.toNumber() == LOTTERY_STATE.CLOSED,
                true,
                "Lottery must not be open when you have NOT the LOTTERY_ROLE role."
            );
        }
        status = await instance.getStatus.call({ from: account_one });
        assert.equal(
            status.toNumber() == LOTTERY_STATE.OPEN,
            true,
            "Lottery must start and be open when you have the LOTTERY_ROLE role."
        );  
    });

    xit(`should pick NOT the winner and deliver EHT when you have NOT the LOTTERY_ROLE role`, async () => {
        let instance = await Lottery.deployed();
        const account_one = accounts[0];
        const account_two = accounts[1];
        const account_three = accounts[2];
        const account_four = accounts[3];
        await instance.enter.sendTransaction({from: account_one, value: ENTER_PRICE });
        await instance.enter.sendTransaction({from: account_two, value: ENTER_PRICE });
        await instance.enter.sendTransaction({from: account_three, value: ENTER_PRICE });
        await instance.enter.sendTransaction({from: account_four, value: ENTER_PRICE });
        const seed = chance.natural();
        try {
            await instance.pick_winner_with.sendTransaction(seed, { from: account_one[9]});    
        } catch (error) {
            status = await instance.getStatus.call({ from: account_one });
            assert.equal(
                status.toNumber() != LOTTERY_STATE.CALCULATING_WINNER,
                true,
                "Lottery must not be calculating the winner when you are not the contract owner"
            );
        }
    });

    xit(`should pick the winner and deliver EHT to the winner account when you have the LOTTERY_ROLE role`, async () => {
        let instance = await Lottery.deployed();
        const account_one = accounts[0];
        const account_ten = accounts[9];
        await instance.add_lottery_worker.sendTransaction(account_ten,{ from: CONTRACT_OWNER });
        const seed = chance.natural();
        await instance.pick_winner_with.sendTransaction(seed, { from: account_ten });
        status = await instance.getStatus.call({ from: account_one });
        assert.equal(
            status.toNumber() != LOTTERY_STATE.CALCULATING_WINNER,
            true,
            "Lottery must not be calculating the winner when you are not the contract owner"
        );
        assert.equal(
            status.toNumber() == LOTTERY_STATE.CLOSED,
            true,
            "Lottery must be closed."
        );
    });

    xit(`should get the last 40 lottery winners`, async () => {
        let instance = await Lottery.deployed();
        const account_one = accounts[0];
        const account_two = accounts[1];
        const account_three = accounts[2];
        const account_four = accounts[3];
        const runLotteryPlays = async () =>{
            const startDate = new Date();
            const endDate = new Date();
            const numberOfDayToAdd = 1;
            endDate.setDate(endDate.getDate() + numberOfDayToAdd );
            await instance.start_new_lottery.sendTransaction(startDate.getTime(), endDate.getTime(),{ from: CONTRACT_OWNER });
            await instance.enter.sendTransaction({from: account_one, value: ENTER_PRICE });
            await instance.enter.sendTransaction({from: account_two, value: ENTER_PRICE });
            await instance.enter.sendTransaction({from: account_three, value: ENTER_PRICE });
            await instance.enter.sendTransaction({from: account_four, value: ENTER_PRICE });
            const seed = chance.natural();
            await instance.pickWinner.sendTransaction(seed, { from: CONTRACT_OWNER });
        };
        const replayLotteryTimes = 40;
        for (let i = 0; i <= replayLotteryTimes; i++) {
            await runLotteryPlays();
        }
        const winners = await instance.getLast40Winners.call({ from: account_one });
        assert.equal(
            winners[0].length > 0,
            true,
            "Must return at least 1 result."
        );
    });

    it("should get the general info from Lottery ", async () => {
        let instance = await Lottery.deployed();
        const account_one = accounts[0];
        const startDate = new Date();
        const endDate = new Date();
        const numberOfDayToAdd = 1;
        endDate.setDate(endDate.getDate() + numberOfDayToAdd );
        await instance.start_new_lottery.sendTransaction(startDate.getTime(), endDate.getTime(),{ from: CONTRACT_OWNER });
        await instance.enter.sendTransaction({from: account_one, value: ENTER_PRICE });
        result = await instance.getLotteryInfo.call({ from: account_one });
        const lottery_state_r = result[0].toNumber();
        const startDate_r = result[1].toNumber();
        const endDate_r = result[2].toNumber();
        const enter_price_r =  web3.utils.fromWei(result[3].toString(), "ether");
        const balance_r =  web3.utils.fromWei(result[4].toString(), "ether");
        assert.equal(
            lottery_state_r === LOTTERY_STATE.OPEN,
            true,
            "Lottery is not open"
        );
        assert.equal(
            startDate_r === startDate.getTime(),
            true,
            "Lottery start date is not correct"
        );
        assert.equal(
            endDate_r === endDate.getTime(),
            true,
            "Lottery end date is not correct"
        );
        assert.equal(
            enter_price_r === web3.utils.fromWei(ENTER_PRICE, "ether"),
            true,
            "Lottery enter price is not correct"
        );
        assert.equal(
            balance_r === web3.utils.fromWei(ENTER_PRICE, "ether"),
            true,
            "Lottery enter price is not correct"
        );
    });

    it("should get the general info from Lottery ", async () => {
        let instance = await Lottery.deployed();
        const account_one = accounts[0];
        const account_two = accounts[1];
        const account_three = accounts[2];
        const account_four = accounts[3];
        await instance.enter.sendTransaction({from: account_one, value: ENTER_PRICE });
        await instance.enter.sendTransaction({from: account_two, value: ENTER_PRICE });
        await instance.enter.sendTransaction({from: account_three, value: ENTER_PRICE });
        await instance.enter.sendTransaction({from: account_four, value: ENTER_PRICE });
        result = await instance.countAllCurrentLotteryPositions.call({ from: account_one });
        const countPositions = result.toNumber();
        assert.equal(
            countPositions === 5,
            true,
            "Lottery count for current positions is not correct"
        );
    });

    it("should get the general info from Lottery ", async () => {
        let instance = await Lottery.deployed();
        const account_one = accounts[0];
        await instance.enter.sendTransaction({from: account_one, value: ENTER_PRICE });
        result = await instance.countCurrentAddressLotteryPositions.call({ from: account_one });
        const countPositions = result.toNumber();
        assert.equal(
            countPositions === 3,
            true,
            "Lottery count for current positions is not correct"
        );
    });
});