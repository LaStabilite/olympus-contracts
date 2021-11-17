require("dotenv").config()
require("@nomiclabs/hardhat-waffle");
const { toWei } = require('web3-utils')

task("status", "Get protocol status")
  .setAction(async () => {
    const stabilUSDBond = await ethers.getContractAt("StabiliteBondDepository", "0x92b7a2AaC2d0eA090e157E95cA44511852372255")
    console.log((await stabilUSDBond.terms()).map(x => x.toString()))
  });

task("tdeposit", "Deposit into the treasury")
  .addParam("amount", "Amount of stabilUSD to deposit")
  .setAction(async ({ amount }) => {
    console.log(`Depositing ${Number(amount).toLocaleString()} stabilUSD into the treasury`)
    const treasury = await ethers.getContractAt("StabiliteTreasury", "0x4124FF3D74925C395f27e039d74dB617d07466fE")
    const stabilUSD = await ethers.getContractAt("StabilUSD", "0x8036Ff9fAc4bBe54355c6d9565ac301c79B79686")
    await stabilUSD.approve(treasury.address, toWei(amount));
    await treasury.deposit(toWei(amount), stabilUSD.address, 0);
  });

task("distribute", "Distributes staking rewards")
  .setAction(async () => {
    const distributor = await ethers.getContractAt("Distributor", "0x8f0E71367770721E7927b0a6c9121797D15936da")
    await distributor.distribute()
  });

module.exports = {
  networks: {
    hardhat: {},
    alfajores: {
      url: "https://alfajores-forno.celo-testnet.org",
      chainId: 44787,
      accounts: [process.env.PRIVATE_KEY],
    }
  },
  solidity: "0.7.5",
};
