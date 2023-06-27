const ID3Minter = artifacts.require("ID3Minter");


module.exports = async (deployer)=>{

  //Desarrollo//
/*   await deployer.deploy(
    ID3Minter,
    "10000000000000000",
    "0x991d7db5a4399a1122537B85e96Bc776A9fBA359"
    ); */

  
      //Producción// 
      await deployer.deploy(
      ID3Minter,
      "0xB818E338FB6E240CaE92a8e0f5092c257Fd5269B"
      );
  

  console.log("Esta es la dirección de ID3Minter Contract", ID3Minter.address);


}


 


