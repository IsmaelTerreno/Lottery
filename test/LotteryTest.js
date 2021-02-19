const Lottery = artifacts.require("Lottery");


contract("Lottery", async accounts => {
    it("should put 1 ETH in the lotery and deliver to the winner account", async () => {
        let instance = await Lottery.deployed();
        const account_one = accounts[0];
        const account_two = accounts[1];
        const account_three = accounts[2];
        const account_four = accounts[3];
        await instance.start_new_lottery.sendTransaction({ from: account_one });
        await instance.enter.sendTransaction({from: account_one, value: web3.utils.toWei("1", "ether") });
        await instance.enter.sendTransaction({from: account_two, value: web3.utils.toWei("1", "ether") });
        await instance.enter.sendTransaction({from: account_three, value: web3.utils.toWei("1", "ether") });
        await instance.enter.sendTransaction({from: account_four, value: web3.utils.toWei("1", "ether") });
        let balance = await instance.getBalance.call({ from: account_one });
        await instance.pickWinner.sendTransaction({ from: account_one });
    });
    xit("should put 0.2 ETH in the lotery and deliver to the winner account", async () => {
        let instance = await Lottery.deployed();
        const account_one = accounts[0];
        const account_two = accounts[1];
        const account_three = accounts[2];
        const account_four = accounts[3];
        await instance.start_new_lottery.call({ from: account_one });
        await instance.enter.sendTransaction({from: account_one, value: web3.utils.toWei("0.2", "ether") });
        await instance.enter.sendTransaction({from: account_two, value: web3.utils.toWei("0.2", "ether") });
        await instance.enter.sendTransaction({from: account_three, value: web3.utils.toWei("0.2", "ether") });
        await instance.enter.sendTransaction({from: account_four, value: web3.utils.toWei("0.2", "ether") });
        let balance = await instance.getBalance.call({ from: account_one });
        await instance.pickWinner.sendTransaction({ from: account_one });
    });
});