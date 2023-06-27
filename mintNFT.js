require('dotenv').config();

const HDWalletProvider = require('@truffle/hdwallet-provider');
const infuraKey = process.env.INFURA_PROJECT_ID;
const nftAddress = process.env.NFT_MINTER_ADDRESS;
const ID3ABI = require ("./build/contracts/ID3Minter.json");
const EthereumTx = require('ethereumjs-tx').Transaction;
const axios = require('axios');
const ethNetwork = `https://goerli.infura.io/v3/${infuraKey}`;

const Web3 = require("web3");

let provider;
let web3Provider;
let accounts;
let ID3Wallet;

//---web3 connection---//

const web3Connect = async () => {

  provider =
    new HDWalletProvider({
    mnemonic: {
      phrase: process.env.DEV_MNEMONIC
    },
    providerOrUrl: `https://goerli.infura.io/v3/${infuraKey}`,
    numberOfAddresses: 1,
    shareNonce: true,
    networkCheckTimeout: 999999,
    })

    web3Provider = new Web3(provider);

    accounts = await web3Provider.eth.getAccounts();
    ID3Wallet = accounts[0];

};


const mintID3NFT = async (courseSKU, studentAccount, courseDate, tokenURI) =>{

  try {

    await web3Connect();

  } catch (err) {

    console.log("error connecting to custodia Wallet", err);

  }

  async function getCurrentGasPrices() {
    let response = await axios.get('https://ethgasstation.info/json/ethgasAPI.json');
    let prices = {
      low: response.data.safeLow / 10,
      medium: response.data.average / 10,
      high: response.data.fast / 10
    };
    return prices;
  }
  
  async function getBalance(address) {
    return new Promise((resolve, reject) => {
      web3Provider.eth.getBalance(address, async (err, result) => {
            if(err) {
                return reject(err);
            }
            resolve(web3Provider.utils.fromWei(result, "ether"));
        });
    });
  }
  

  const ID3Contract = await new web3Provider.eth.Contract(
    ID3ABI.abi,
    nftAddress
  );

  //console.log("Métodos", ID3Contract.methods)

  try { 

  let alreadyMinted = await ID3Contract.methods.alreadyMint(studentAccount, cursoSKU).call();

  if(alreadyMinted){

    return "Account already minted"

  } else {

  return new Promise(async (resolve, reject) => {

    var nonce = await web3Provider.eth.getTransactionCount(ID3Wallet);

    web3Provider.eth.getBalance(ID3Wallet, async (err, result) => {
        if (err) {
            return reject();
        }
        let balance = web3Provider.utils.fromWei(result, "ether");
        console.log("Virtual Wallet balance is " + balance + "ETH");

        let gasPrices = await getCurrentGasPrices();
        let details = {
            "to": studentAccount,
            "value": web3Provider.utils.toHex(web3Provider.utils.toWei(amount, 'ether')),
            "gas": 21000,
            "gasPrice": gasPrices.low * 1000000000,
            "nonce": nonce,
            "chainId": 5 // EIP 155 chainId - mainnet: 1, Goerli: 5
        };
       
        console.log("Gas prices " + gasPrices.low);

        const transaction = new EthereumTx(details, {chain: 'goerli'});

        let privateKey = process.env.PRIVATE_KEY.split('0x');

        console.log("Private Key " + privateKey);

        let privKey = Buffer.from(privateKey[0],'hex');
        
        transaction.sign(privKey);
       
        const serializedTransaction = transaction.serialize();
       
        web3Provider.eth.sendSignedTransaction('0x' + serializedTransaction.toString('hex'), async(err, id) => {
            if(err) {
                console.log(err);
                return reject();
            }
            const url = `https://goerli.etherscan.io/tx/${id}`;

            console.log(url);

            await ID3Contract.methods.safeMint(studentAccount, nombreEstudiante, cursoSKU , fechaCurso, uriToken).send({from: ID3Wallet})
            .then((txn)=>{
      
                let tokenId = txn.events.Transfer.returnValues.tokenId;
                let finalNFTURL = `https://testnets.opensea.io/assets/goerli/${contractAddress}/${tokenId}`
            
                console.log("tokenID resultado txn", tokenId);

                provider.engine.stop();

                resolve({idTx: id, tokenID: tokenId, link: finalNFTURL});
            
            })
              .catch(()=>{
    
                  alert("Error in returned transaction");
    
              });


        });
    });
});
}

  } catch (err) {
    console.log("Blockchain error", err);
  }

}


module.exports = { mintID3NFT }
  