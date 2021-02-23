const Lottery = artifacts.require("Lottery");
const { APP_CONFIG } = require("../truffle-config");

contract("Lottery", async accounts => {
    const LOTTERY_STATE = { OPEN: 0, CLOSED: 1, CALCULATING_WINNER:2 };
    const ENTER_PRICE = web3.utils.toWei(APP_CONFIG.ENTER_PRICE_LOTTERY_IN_ETHER, "ether"); 

    it("should start a new lottery", async () => {
        let instance = await Lottery.deployed();
        const account_one = accounts[0];
        await instance.start_new_lottery.sendTransaction({ from: account_one });
        status = await instance.getStatus.call({ from: account_one });
        assert.equal(
            status.toNumber(),
            LOTTERY_STATE.OPEN,
            "Lottery is not open"
        );
    });

    it("should store sent value in the contract for a new lotery", async () => {
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

    it(`should pick the winner and deliver EHT to the winner account`, async () => {
        let instance = await Lottery.deployed();
        const account_one = accounts[0];
        await instance.pickWinner.sendTransaction({ from: account_one });
        const result = await instance.getLastWinner.call({ from: account_one });
        let winner = result[1];
        let fromBlock = result[0];
        let value = web3.utils.fromWei(result[2].toString(), "ether");
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
        const result2 = await instance.getWinnerAtBlock.call(fromBlock.toNumber(), { from: account_one });
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

    it(`should pick the winner at one particular block in history`, async () => {
        let instance = await Lottery.deployed();
        const account_one = accounts[0];
        const result = await instance.getLastWinner.call({ from: account_one });
        let fromBlock = result[0].toNumber();
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

    it(`should put ${ENTER_PRICE} Wei in the lotery and deliver to the winner account with 4 accounts`, async () => {
        let instance = await Lottery.deployed();
        const account_one = accounts[0];
        const account_two = accounts[1];
        const account_three = accounts[2];
        const account_four = accounts[3];
        await instance.start_new_lottery.sendTransaction({ from: account_one });
        await instance.enter.sendTransaction({from: account_one, value: ENTER_PRICE });
        await instance.enter.sendTransaction({from: account_two, value: ENTER_PRICE });
        await instance.enter.sendTransaction({from: account_three, value: ENTER_PRICE });
        await instance.enter.sendTransaction({from: account_four, value: ENTER_PRICE });
        await instance.pickWinner.sendTransaction({ from: account_one });
    });
});