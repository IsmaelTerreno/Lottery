//const Migrations = artifacts.require("Migrations");
const FAssetToken = artifacts.require("FAssetToken");
const Lottery = artifacts.require("Lottery");
module.exports = function (deployer) {
  //deployer.deploy(Migrations);
  deployer.deploy(FAssetToken, '0xdF9585FA2F84Eb334135c37aa2060Ad5812C0a42');
  deployer.deploy(Lottery);
};
