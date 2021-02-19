//const Migrations = artifacts.require("Migrations");
const FAssetToken = artifacts.require("FAssetToken");
const Lottery = artifacts.require("Lottery");
module.exports = function (deployer) {
  //deployer.deploy(Migrations);
  deployer.deploy(FAssetToken, '0xdF9585FA2F84Eb334135c37aa2060Ad5812C0a42');
  const enter_price = web3.utils.toWei("0.2", "ether");
  const owner_beneficiary = '0x9982f781Ac9853db1c04a3534ce40d93e7cC473c';
  deployer.deploy(
    Lottery, 
    owner_beneficiary, 
    enter_price
  );
};
