const { APP_CONFIG } = require("../truffle-config");
const Lottery = artifacts.require("Lottery");
module.exports = (deployer) => {
  const enter_price = web3.utils.toWei(APP_CONFIG.ENTER_PRICE_LOTTERY_IN_ETHER, "ether");
  const owner_beneficiary = APP_CONFIG.BENEFICIARY_OWNER;
  const contract_owner = APP_CONFIG.CONTRACT_OWNER;
  deployer.deploy(
    Lottery, 
    contract_owner,
    owner_beneficiary, 
    enter_price
  );
};
