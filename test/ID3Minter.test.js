const { token } = require("morgan");

const ID3Minter = artifacts.require("ID3Minter");

let minter;

let contractOwner;
let beneficiarioWallet;
let esStudent;
let diploma;
let tokenOwner;
let tokenURI;
let royaltyInfo;
let tokenPrice;
let tokensMinted

const emptyAddress = "0x0000000000000000000000000000000000000000";


beforeEach(async () => {
  
  minter = await ID3Minter.deployed();

});

contract('ID3Minter', async (accounts) => {

  it('los contratos deben desplegarse a la red', () => {
    
    console.log('ID3Minter address', minter.address);

  });


  it('Revisa constructor', async() => {

    beneficiarioWallet = await minter.getBeneficiarioWallet();

    console.log("Beneficiario Wallet", beneficiarioWallet);

    tokensMinted = await minter.getCurrentTokenId();

    console.log("Current token Id", tokensMinted.toString());


  });
  

  it('Crea diploma', async() => {

    await minter.isStudentSetter(accounts[9]);

    esStudent = await minter.isStudentGetter(accounts[9]);

    console.log("Es Student", esStudent);

    await minter.mintDiploma(accounts[9], "Emmanuel Martinez", "Fundamentos de Cripto-coleccionables", "2023-1","https://bafkreig5hmkz3so5tpsdzzxfru75s33wfpt344kta57jbhbebzyc23mr5i.ipfs.nftstorage.link/");

    tokenOwner = await minter.ownerOf(1);

    console.log("Owner of Token 1", tokenOwner);

    tokenURI = await minter.tokenURI(1);

    console.log("URI Token 1", tokenURI);

    diploma = await minter.getDiploma(accounts[9], "Fundamentos de Cripto-coleccionables", { from: accounts[9]});

    console.log("Diploma almacenado en Blockchain", diploma);

    tokensMinted = await minter.getCurrentTokenId();

    console.log("Current token Id después del primer diploma", tokensMinted.toString());

  });

  it('Mint pagado', async() => {

      tokenPrice =  await minter.tokenPrice()

      console.log("Token Price antes de setPrice", tokenPrice.toString());

      await minter.setPrice("100000000000000000");

      tokenPrice =  await minter.tokenPrice()

      console.log("Token Price después de setPrice", tokenPrice.toString());
 
      await minter.payableMint("www.tokenMintedPayed.com", accounts[8], { from: accounts[8], value: tokenPrice });

      tokenOwner = await minter.ownerOf(2);

      console.log("Owner of Token 2 (payableMint)", tokenOwner);
  
      tokenURI = await minter.tokenURI(2);
  
      console.log("URI Token 2", tokenURI);
  
    });

    it('Retira fondos', async() => {

      let balance = await web3.eth.getBalance(accounts[0]);

      let fundsBeneficiario = await minter.payments(accounts[0])

      console.log("Fondos del beneficiario antes del retiro", fundsBeneficiario.toString());

      console.log("Balance antes de retirar fondos", balance);

      await minter.withdrawPayments(accounts[0]);

      balance = await web3.eth.getBalance(accounts[0]);

      fundsBeneficiario = await minter.payments(accounts[0])

      console.log("Fondos del beneficiario despues del retiro", fundsBeneficiario.toString());

      console.log("Balance después de retirar fondos", balance);

    });

    it('Cambia beneficiario', async() => {

      await minter.setbeneficiarioWallet(accounts[1]);

      beneficiarioWallet = await minter.getBeneficiarioWallet();

      console.log("Beneficiario Wallet", beneficiarioWallet);

      tokenPrice =  await minter.tokenPrice()

      await minter.payableMint("www.tokenMintedPayedNewBeneficiary.com", accounts[3], { from: accounts[3], value: tokenPrice });

      fundsBeneficiario = await minter.payments(accounts[0])

      console.log("Fondos del beneficiario anterior", fundsBeneficiario.toString());

      fundsBeneficiario = await minter.payments(accounts[1])

      console.log("Fondos del beneficiario nuevo", fundsBeneficiario.toString());

    });


  it('Editar diploma', async() => {

      await minter.editDiploma(accounts[9], "Fundamentos de Cripto-coleccionables", "Jaime Velázquez", "2023-2")
      diploma = await minter.getDiploma(accounts[9], "Fundamentos de Cripto-coleccionables", { from: accounts[9]});
      console.log("Diploma almacenado en Blockchain", diploma);
    
      });


  it('Update de la metadata', async() => {

    await minter.updateTokenURI(1, "www.google.com");

    tokenURI = await minter.tokenURI(1);

    console.log("URI Token 1 modificada", tokenURI);


  }); 

  it('Transfiere ownership', async() => {

    contractOwner = await minter.owner();

    console.log("Owner del contrato", contractOwner);

    await minter.transferOwnership(accounts[1]);

    contractOwner = await minter.owner();

    console.log("Owner del contrato después de transferir ownership", contractOwner);

    //await minter.setPrice("1000");

    await minter.setPrice("1000", {from: accounts[1]});

    tokenPrice =  await minter.tokenPrice()

    console.log("Token Price después de setPrice", tokenPrice.toString());

  }); 

  it('Mint transferido por la ESAT', async() => {

    await minter.mintTo(accounts[5], "www.tokenMintedTransfered.com", { from: accounts[1]});

    tokenOwner = await minter.ownerOf(3);

    console.log("Owner of Token 3 (mintTo)", tokenOwner);

    tokenURI = await minter.tokenURI(3);

    console.log("URI Token 3", tokenURI);


  });

  it('Pausa y reanuda el contrato', async() => {

    await minter.pause({from: accounts[1]});
    await minter.unpause({from: accounts[1]});

    diploma = await minter.getDiploma(accounts[9], "Fundamentos de Cripto-coleccionables", { from: accounts[9]});

    console.log("Diploma almacenado en Blockchain (pause/unpause)", diploma);

    }

  );

  it('Funciones de borrado', async() => {

    diploma = await minter.getDiploma(accounts[9], "Fundamentos de Cripto-coleccionables");

    console.log("Diploma almacenado en Blockchain (antes del borrado)", diploma);

    await minter.deleteDiploma(accounts[9], "Fundamentos de Cripto-coleccionables", { from: accounts[1]});

    diploma = await minter.getDiploma(accounts[9], "Fundamentos de Cripto-coleccionables", { from: accounts[9]});

    console.log("Diploma almacenado en Blockchain (borrado)", diploma);

    esStudent = await minter.isStudentGetter(accounts[9]);

    console.log("Es Student antes del borrado", esStudent);

    await minter.deleteStudentEnrolled(accounts[9], { from: accounts[1]});

    esStudent = await minter.isStudentGetter(accounts[9]);

    console.log("Es Student después del borrado", esStudent);

  });


  it('Revisar approvals', async() => {

    let approvedToken1 = await minter.getApproved(1);

    console.log("Approved Token 1", approvedToken1);

    let approvedToken2 = await minter.getApproved(2);

    console.log("Approved Token 2", approvedToken2);

    let approvedToken3 = await minter.getApproved(3);

    console.log("Approved Token 3", approvedToken3);

  })

  it("Quemar tokens", async() => {

    //await minter.burn(1, { from: accounts[0] });

    await minter.burn(1, { from: accounts[9] });

    //let tokenURI = await minter.tokenURI(1);

    //console.log("Token URI 1 después de quemar", tokenURI);

    //await minter.burn(2, { from: accounts[0] });

    await minter.burn(2, { from: accounts[8] });

    //tokenURI = await minter.tokenURI(2);

    //console.log("Token URI 2 después de quemar", tokenURI);

    //await minter.burn(3, { from: accounts[0] });

    await minter.burn(3, { from: accounts[3] });

    //tokenURI = await minter.tokenURI(3);

    //console.log("Token URI 3 después de quemar", tokenURI);

     //await minter.burn(4, { from: accounts[1] });

    await minter.burn(4, { from: accounts[5] });

    //tokenURI = await minter.tokenURI(4);

    //console.log("Token URI 4 después de quemar", tokenURI);


  });

});
