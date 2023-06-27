require('dotenv').config();
const fs = require('fs');
const Web3 = require('web3');
const HDWalletProvider = require('@truffle/hdwallet-provider');

async function createContractInstanceAndSafeMint() {
  
  const infuraProvider = `https://polygon-mumbai.infura.io/v3/${process.env.INFURA_PROJECT_ID}`;
  
  // HD Wallet provider
  const mnemonic = process.env.DEV_MNEMONIC;

  const provider = new HDWalletProvider({
    mnemonic: {
      phrase: mnemonic
    },
    providerOrUrl: infuraProvider
  });

  // Create Web3 instance and set the provider
  const web3 = new Web3(provider);

  // Get the selected account from the provider
  const accounts = await web3.eth.getAccounts();
  const account = accounts[0];

  // Replace with your contract address
  const contractAddress = '0xaa8F049337D4A3ADa4392CdC0c8eb49184972C19';

  // Fetch the contract ABI from a local file
  const contractABI = JSON.parse(fs.readFileSync('./build/contracts/ID3Minter.json', 'utf8'));

  // Create an instance of the contract using the contract ABI
  const contract = new web3.eth.Contract(contractABI.abi, contractAddress);

  // Auténtico
  //const url = 'https://bafkreig5hmkz3so5tpsdzzxfru75s33wfpt344kta57jbhbebzyc23mr5i.ipfs.nftstorage.link/';

  //Falso
  const url = 'https://bafkreiel5csh6nu2dtautejdlytdd3jod6xwj6hgva54tc4ct63n5tzdpa.ipfs.nftstorage.link/';

  // Call the 'safeMint' function on the contract
  const result = await contract.methods.safeMint(cursoSKU, nombreEstudiante, fechaCurso, uriToken).send({ from: account });

  console.log('Transaction hash:', result.transactionHash);
  console.log('Token ID:', result.events.Transfer.returnValues.tokenId);
}

createContractInstanceAndSafeMint()
  .then(() => {
    console.log('Contract instance created and safe minting successful.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  })
  .finally(() => {
    // Handle any necessary cleanup or post-execution tasks
  });
