const express = require('express');
const bodyParser = require('body-parser');
const Web3 = require('web3');
const HDWalletProvider = require('@truffle/hdwallet-provider');
const contract = require('truffle-contract');
const DiplomaContractABI = require('./build/contracts/ID3Minter.json');

require("dotenv").config();

// Initialize express
const app = express();

// Middleware
app.use(bodyParser.json());

// HD Wallet provider
const mnemonic = process.env.DEV_MNEMONIC;

let provider;
try {
  provider = new HDWalletProvider(mnemonic, `https://polygon-mumbai.infura.io/v3/${process.env.INFURA_PROJECT_ID}`);
} catch (error) {
  console.error("Error creating HDWalletProvider", error);
}

// Web3 and contract initialization
const web3 = new Web3(provider);
const DiplomaContract = contract(DiplomaContractABI);
DiplomaContract.setProvider(web3.currentProvider);

// Start server
const port = process.env.PORT || 3000;

async function startServer() {
  // Instance of deployed contract
  let DiplomaContractInstance;

  try {
    DiplomaContractInstance = await DiplomaContract.deployed();
    //console.log("DiplomaContractInstance Methods: ", DiplomaContractInstance.methods);
  } catch (error) {
    console.log("Error getting DiplomaContract instance: ", error);
  }

  // Routes
  app.use('/api/diplomaid3', require('./routes/diplomaid3')(DiplomaContractInstance, web3));

  app.listen(port, () => console.log(`Server running on port ${port}`));
}

startServer();

process.on('unhandledRejection', (reason, promise) => {
    console.log('Unhandled Rejection at:', promise, 'reason:', reason);
});