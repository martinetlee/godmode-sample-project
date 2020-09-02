/**
 * ExternalContracts.test.js
 *
 * GodMode demo of external contracts currently deployed on mainnet.
 * */

const GM = require("godmode-for-test");
const HasOwnerShip = artifacts.require("HasOwnerShip");
const HasOwnerShipInstrumented = artifacts.require("HasOwnerShipInstrumented");
const HasOwnerShipSETOWNER = artifacts.require("HasOwnerShipSETOWNER");
const UniswapV2ERC20Contract = artifacts.require("UniswapV2ERC20Contract");
const UniswapV2FactoryContract = artifacts.require("UniswapV2FactoryContract");
const UniswapV2PairContract = artifacts.require("UniswapV2PairContract");
const CErc20Contract = artifacts.require("CErc20Contract");
const Dai = artifacts.require("Dai");


const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";  

const GODMODE = new GM("development", "http://34.212.163.248/api");

contract("GodMode Demo - External Contracts", function(accounts) {
  const Alex = accounts[1];
  const Beth = accounts[2];
  const Carl = accounts[3];

  describe("Mainnet DAI in GodMode", function(){
    before(async function() { await GODMODE.open(); });
    after(async function() { await GODMODE.close(); });

    it("can mint DAI to any account as much as I want", async function(){
      let mainnetDaiAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
      let daiContract = await Dai.at(mainnetDaiAddress);

      // Balance starts at 0
      let startingBalance = await daiContract.balanceOf(Alex);
      assert.equal(startingBalance, 0);
      console.log("Alex's starting balance:", startingBalance);

      // Mint x times
      let x = Math.random();
      for(var i = 0 ; i < x; i++){
        await GODMODE.mintDai(Alex, 100);
      }

      // Balance ends at 100x!
      let endingBalance = await daiContract.balanceOf(Alex);
      assert.equal(endingBalance, 100 * x);
      console.log("Alex's Ending balance is", endingBalance);
    });
  });
  
  describe("Mainnet Uniswap V2 in GodMode", function(){
    before(async function() { await GODMODE.open(); });
    after(async function() { await GODMODE.close(); });

    it("can set any account I want as the fee collector", async function(){
      let mainnetFactoryAddress = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";
      let factoryContract = await UniswapV2FactoryContract.at(mainnetFactoryAddress);

      // Initially, feeTo is not set, and no fee is collected
      let startingFeeCollector = await factoryContract.feeTo();
      assert.equal(startingFeeCollector, ZERO_ADDRESS);
      console.log("Starting fee collector is no one:", startingFeeCollector);

      // Set feeTo
      await GODMODE.uniswapV2Factory_setFeeTo(Beth);

      // feeTo is set!
      let endingFeeCollector = await factoryContract.feeTo();
      assert.equal(endingFeeCollector, Beth);
      console.log("Ending fee collector is Beth!", endingFeeCollector);
    });    
  });
  
  describe("Mainnet Compound in GodMode", function(){
    before(async function() { await GODMODE.open(); });
    after(async function() { await GODMODE.close(); });

    it("can give CTokens to any account I want", async function(){
      let mainnetCBAT = "0x6c8c6b02e7b2be14d4fa6022dfd6d75921d90e4e";
      let cBAT = await CErc20Contract.at(mainnetCBAT);

      // Balance starts at 0
      let startingBalance = await cBAT.balanceOf(Carl);
      assert.equal(startingBalance, 0);
      console.log("Carl's starting balance is", startingBalance);

      // Give address tokens
      await GODMODE.CToken_giveAddrTokens(mainnetCBAT, Carl, 100); 

      // Balance ends at 100!
      let endingBalance = await cBAT.balanceOf(Carl);
      assert.equal(endingBalance, 100);       
      console.log("Carl's ending balance is", endingBalance);
    })
  });
});
