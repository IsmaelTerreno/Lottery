const { APP_CONFIG } = require("../truffle-config");
const Lottery = artifacts.require("Lottery");
module.exports = (deployer) => {
  const enter_price = web3.utils.toWei(APP_CONFIG.ENTER_PRICE_LOTTERY_IN_ETHER, "ether");
  const owner_beneficiary = APP_CONFIG.OWNER_BENEFICIARY;
  deployer.deploy(
    Lottery, 
    owner_beneficiary, 
    enter_price
  );
};
