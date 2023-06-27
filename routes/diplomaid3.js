import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, doc, getDoc, collection } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
const express = require('express');
const router = express.Router();

require("dotenv").config();

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGIN_SENDER_ID,
  appId: process.env.APP_ID
  };
  
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const stateAPI = {

  "APIID3Status": "Overall Status OK",
  "MINTERSTATUS": "Minter Status OK" 
        
}

// Function to check the authenticity of data
  const checkAuthenticity = async (skuCurso, estudiante, fecha) => {
      const docRef = doc(db, 'autenticidad', skuCurso);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.subscribed) {
              for (let sub of data.subscribed) {
          if (sub.estudiante === estudiante && sub.fecha === fecha) {
        return true;
      }
    }
    }
    }
    return false;
    };

module.exports = (DiplomaContractInstance, web3) => {

  const contractID3 = new web3.eth.Contract(DiplomaContractInstance.abi, process.env.NFT_MINTER_ADDRESS)

  router.get('/', async (req, res) => {

      let { APIID3Status } = stateAPI;

      res.send(

      { 
        "APIID3Status" : `${APIID3Status}`,
        "Endpoints" : {
          "Getters": {
          "Get current Token ID " : "/getcurrenttoken",
          "Get Token Price": "/gettokenprice",
          "Is student enrolled": "/isstudentenrolled?studentaccount=someaccount",
          "Get student diploma": "/getstudentdiploma?studentaccount=someaccount&coursesku=coursename",
          "Get beneficiary wallet": "/getbeneficiarywallet",
          },
          "Setters": {
          "Set an account as student" : "/isstudentsetter?studentaccount=someaccount",
          "Set beneficiary wallet": "/setbeneficiarywallet?beneficiarywallet=someaccount",
          "Set token price": "/settokenprice?tokenprice=priceinwei"  
          },
          "Minters": {
          "Mint a new Diploma": "/mintdiploma?studentaccount=someaccount&name=studentname&coursesku=coursename&coursedate=timeperiod&tokenuri=tokenuri",
          "Mint with price": "/minttokenwithprice?tokenuri=tokenuri&mintto=accounttomint",
          "Mint a free token": "/mintfreetoken?accounttomint=accounttomint&tokenuri=tokenuri"
          },
          "Edits": {
          "Edit token URI": "/edittokenuri?tokenid=tokenid&tokenuri=tokenuri",
          "Edit Diploma": "/editdiploma?studentaccount=someaccount&coursesku=coursename&name=studentnewname&coursedate=newcoursedate"
          },
          "Pause/Unpause": {
          "Pause contract": "/pausecontract",
          "Unpause contract": "/unpausecontract"
          },
          "Utilities": {
          "Get virtual wallet balance": "/getwalletbalance",
          "Get virtual wallet address": "/getwalletaddress",
          "Pull funds from contract": "/pullfundsfromcontract",
          "Validate token" : "/validatetoken?studentaccount=someaccount&coursesku=coursename&coursedate=timeperiod"
          },
          "Delete": {
            "Delete token": "/deletetoken?tokenid=tokenid",
            "Delete diploma": "/deletediploma?studentaccount=someaccount&coursesku=coursename",
            "Delete student enrolled": "/deletestudentenrolled?studentaccount=someaccount"
          } 
        }
      }
      );
  });

  /* GETTERS */

  router.get('/getcurrenttoken', async (req, res) => {

        const accounts = await web3.eth.getAccounts();

        try {

            let currentToken = await contractID3.methods.getCurrentTokenId().call({ from:accounts[0]})
            
            res.send({ "Current TokenID" : `${currentToken}` });

        } catch (err) {
            res.status(500).send(err.toString());
        }

      });

  router.get('/gettokenprice', async (req, res) => {

        const accounts = await web3.eth.getAccounts();

        try {

            let tokenPrice = await contractID3.methods.tokenPrice().call({ from:accounts[0]})

            res.send({ "Token Price" : `${tokenPrice}` });

        } catch (err) {

          res.status(500).send(err.toString());

        }
    });

    router.get('/isstudentenrolled', async (req, res) => {

      const accounts = await web3.eth.getAccounts();

      const studentaccount = req.query.studentaccount;

      try {

          let isStudent = await contractID3.methods.isStudentGetter(studentaccount).call({ from:accounts[0]})

          res.send({ "Is student" : `${isStudent}` });

      } catch (err) {

        res.status(500).send(err.toString());
        
      }
  });

  router.get('/getstudentdiploma', async (req, res) => {

    const accounts = await web3.eth.getAccounts();

    const studentaccount = req.query.studentaccount;
    const coursesku = req.query.coursesku;

    try {

        let studentDiploma = await contractID3.methods.getDiploma(studentaccount, coursesku).call({ from:accounts[0]})

        res.send({ "Student Diploma" : `${studentDiploma}` });

    } catch (err) {

      res.status(500).send(err.toString());

    }
  });

  router.get('/getbeneficiarywallet', async (req, res) => {

    const accounts = await web3.eth.getAccounts();

    try {

        let beneficiaryWallet = await contractID3.methods.getBeneficiarioWallet().call({ from:accounts[0]})

        res.send({ "Beneficiary Wallet" : `${beneficiaryWallet}` });

    } catch (err) {

      res.status(500).send(err.toString());

    }
  });

    /* SETTERS */

    router.post('/isstudentsetter', async (req, res) => {

      const { pass } = req.body;

      const studentaccount = req.query.studentaccount;

      if( pass == process.env.PASS_TO_AUTH){

              console.log("Autorized");

              const accounts = await web3.eth.getAccounts();

              try {

                const txn = await contractID3.methods.isStudentSetter(studentaccount).send({ from: accounts[0] } );

                res.status(200).json(txn);

        
              } catch (err) {
        
              res.status(500).send(err.toString());
        
              }
              
  
      } else {
  
          res.status(401).json({Error:"Unauthorized"});
  
      }

    });

    router.post('/setbeneficiarywallet', async (req, res) => {

      const { pass } = req.body;

      const beneficiarywallet = req.query.beneficiarywallet;

      if( pass == process.env.PASS_TO_AUTH){

              console.log("Autorized");

              const accounts = await web3.eth.getAccounts();

              try {

                const txn = await contractID3.methods.setbeneficiarioWallet(beneficiarywallet).send({ from: accounts[0] } );

                console.log("txn: ", txn);

                res.status(200).json({"Transaction url": `https://mumbai.polygonscan.com/tx/${txn.transactionHash}`});


              } catch (err) {

                res.status(500).send(err.toString());

              }

            } else {
  
              res.status(401).json({Error:"Unauthorized"});
      
          }
    
    });


    router.post('/settokenprice', async (req, res) => {

      const { pass } = req.body;

      const newtokenPrice = req.query.tokenprice;

      if( pass == process.env.PASS_TO_AUTH){

              console.log("Autorized");

              const accounts = await web3.eth.getAccounts();

              try {

                const txn = await contractID3.methods.setPrice(newtokenPrice).send({ from: accounts[0] } );

                console.log("txn: ", txn);

                res.status(200).json({"Transaction url": `https://mumbai.polygonscan.com/tx/${txn.transactionHash}`});


              } catch (err) {

                res.status(500).send(err.toString());

              }

            } else {
  
              res.status(401).json({Error:"Unauthorized"});
      
          }
    
    });
  
  /* MINTERS */

  router.post('/mintdiploma', async (req, res) => {

    const { pass } = req.body;
   
    const studentaccount = req.query.studentaccount;
    const studentname = req.query.studentname;
    const coursesku = req.query.coursesku;
    const coursedate = req.query.coursedate;
    const tokenuri = req.query.tokenuri;

    if( pass == process.env.PASS_TO_AUTH){

            console.log("Autorized");

            const accounts = await web3.eth.getAccounts();

            try {

              const txn = await contractID3.methods.mintDiploma(studentaccount, studentname, coursesku, coursedate, tokenuri).send({ from: accounts[0] } );

              console.log("txn: ", txn);

              res.status(200).json({"Transaction url": `https://mumbai.polygonscan.com/tx/${txn.transactionHash}`});


            } catch (err) {

              res.status(500).send(err.toString());

            }

          } else {

            res.status(401).json({Error:"Unauthorized"});
    
        }
  
  });

  router.post('/minttokenwithprice', async (req, res) => {

    const { pass } = req.body;
   
    const tokenuri = req.query.tokenuri;
    const mintTo = req.query.mintto;

    if( pass == process.env.PASS_TO_AUTH){

            console.log("Autorized");

            const accounts = await web3.eth.getAccounts();

            try {

              let tokenPrice = await contractID3.methods.tokenPrice().call({ from:accounts[0]})

              const txn = await contractID3.methods.payableMint(tokenuri, mintTo).send({ from: accounts[0], value: tokenPrice } );

              console.log("txn: ", txn);

              res.status(200).json({"Transaction url": `https://mumbai.polygonscan.com/tx/${txn.transactionHash}`});


            } catch (err) {

              res.status(500).send(err.toString());

            }

          } else {

            res.status(401).json({Error:"Unauthorized"});
    
        }
  
  });

  router.post('/mintfreetoken', async (req, res) => {

    const { pass } = req.body;
   
    const tokenuri = req.query.tokenuri;
    const mintTo = req.query.accounttomint;

    if( pass == process.env.PASS_TO_AUTH){

            console.log("Autorized");

            const accounts = await web3.eth.getAccounts();

            try {

              const txn = await contractID3.methods.mintTo(mintTo, tokenuri).send({ from: accounts[0] } );

              console.log("txn: ", txn);

              res.status(200).json({"Transaction url": `https://mumbai.polygonscan.com/tx/${txn.transactionHash}`});


            } catch (err) {

              res.status(500).send(err.toString());

            }

          } else {

            res.status(401).json({Error:"Unauthorized"});
    
        }
  
  });

  /* EDITS */

  router.post('/edittokenuri', async (req, res) => {

    const { pass } = req.body;
   
    const tokenid = req.query.tokenid;
    const tokenuri = req.query.tokenuri;

    if( pass == process.env.PASS_TO_AUTH){

            console.log("Autorized");

            const accounts = await web3.eth.getAccounts();

            try {

              const txn = await contractID3.methods.updateTokenURI(tokenid, tokenuri).send({ from: accounts[0] } );

              console.log("txn: ", txn);

              res.status(200).json({"Transaction url": `https://mumbai.polygonscan.com/tx/${txn.transactionHash}`});


            } catch (err) {

              res.status(500).send(err.toString());

            }

          } else {

            res.status(401).json({Error:"Unauthorized"});
    
        }
  
  });

  router.post('/editdiploma', async (req, res) => {

    const { pass } = req.body;

    const studentaccount = req.query.studentaccount;
    const coursesku = req.query.coursesku;
    const name = req.query.name;
    const coursedate =  req.query.coursedate;


    if( pass == process.env.PASS_TO_AUTH){

            console.log("Autorized");

            const accounts = await web3.eth.getAccounts();

            try {

              const txn = await contractID3.methods.editDiploma(studentaccount, coursesku, name, coursedate ).send({ from: accounts[0] } );

              console.log("txn: ", txn);

              res.status(200).json({"Transaction url": `https://mumbai.polygonscan.com/tx/${txn.transactionHash}`});


            } catch (err) {

              res.status(500).send(err.toString());

            }

          } else {

            res.status(401).json({Error:"Unauthorized"});
    
        }
  
  });

  /* PAUSE / UNPAUSE */

  router.post('/pausecontract', async (req, res) => {

    const { pass } = req.body;

    if( pass == process.env.PASS_TO_AUTH){

            console.log("Autorized");

            const accounts = await web3.eth.getAccounts();

            try {

              const txn = await contractID3.methods.pause().send({ from: accounts[0] } );

              console.log("txn: ", txn);

              res.status(200).json({"Transaction url": `https://mumbai.polygonscan.com/tx/${txn.transactionHash}`});


            } catch (err) {

              res.status(500).send(err.toString());

            }

          } else {

            res.status(401).json({Error:"Unauthorized"});
    
        }
  
  });

  router.post('/unpausecontract', async (req, res) => {

    const { pass } = req.body;

    if( pass == process.env.PASS_TO_AUTH){

            console.log("Autorized");

            const accounts = await web3.eth.getAccounts();

            try {

              const txn = await contractID3.methods.unpause().send({ from: accounts[0] } );

              console.log("txn: ", txn);

              res.status(200).json({"Transaction url": `https://mumbai.polygonscan.com/tx/${txn.transactionHash}`});


            } catch (err) {

              res.status(500).send(err.toString());

            }

          } else {

            res.status(401).json({Error:"Unauthorized"});
    
        }
  
  });

  /* UTILITIES */

  router.get('/getwalletbalance', async (req, res) => {

    const accounts = await web3.eth.getAccounts();

    try {

      let balanceInWei = await web3.eth.getBalance(accounts[0]);
      //console.log("Balance in Wei: ", balanceInWei);
  
      let balanceInEther = web3.utils.fromWei(balanceInWei, 'ether');
      //console.log("Balance in Ether: ", balanceInEther);

      res.send({ "Balance in Wei:" : `${balanceInWei}`,
                 "Balance in Ether" : `${balanceInEther}`
    });

    } catch (err) {

      res.status(500).send(err.toString());

    }
  });

  router.get('/getwalletaddress', async (req, res) => {

    const accounts = await web3.eth.getAccounts();

    try {

      res.status(200).json({ "Virtual Wallet Address:" : `${accounts[0]}`});

    } catch (err) {

      res.status(500).send(err.toString());

    }
  });

  router.get('/pullfundsfromcontract', async (req, res) => {

  
    try {

      res.status(200).json({ "HTML Site" : "Soon"});

    } catch (err) {

      res.status(500).send(err.toString());

    }
  });


  router.get('/validatetoken', async (req, res) => {

  
    try {

      res.status(200).json({ "HTML Site" : "Soon"});

    } catch (err) {

      res.status(500).send(err.toString());

    }
  });


  router.post('/validatetoken', async (req, res) => {

    const { pass } = req.body;
   
    const studentaccount = req.query.studentaccount;
    const coursesku = req.query.coursesku;

    if( pass == process.env.PASS_TO_AUTH){

            console.log("Autorized");

            const accounts = await web3.eth.getAccounts();

            let isStudent = await contractID3.methods.isStudentGetter(studentaccount).call({ from:accounts[0]});

            if(isStudent){

            try {

              let studentDiploma = await contractID3.methods.getDiploma(studentaccount, coursesku).call({ from:accounts[0]});

              if(studentDiploma.minted){

              checkAuthenticity(studentDiploma.course, studentDiploma.name, studentDiploma.date)
              .then(isAuthentic => {

                isAuthentic ? res.send({ "Student Diploma" : "Authentic" }) : res.send({ "Student Diploma" : "Not authentic" });
                
              });
              } else {

                res.send({ "Student Diploma" : "Not minted" });

              }


            } catch (err) {

              res.status(500).send(err.toString());

            }

            } else {
              
              res.status(401).json({Error:"Not student"});

          }

          } else {

            res.status(401).json({Error:"Unauthorized"});
    
        }
  
  });
  
  /* DELETE */

  router.post('/deletetoken', async (req, res) => {

    const { pass } = req.body;
    const tokenid = req.query.tokenid;

    if( pass == process.env.PASS_TO_AUTH){

            console.log("Autorized");

            const accounts = await web3.eth.getAccounts();

            try {

              const txn = await contractID3.methods.burn(tokenid).send({ from: accounts[0] } );

              console.log("txn: ", txn);

              res.status(200).json({"Transaction url": `https://mumbai.polygonscan.com/tx/${txn.transactionHash}`});


            } catch (err) {

              res.status(500).send(err.toString());

            }

          } else {

            res.status(401).json({Error:"Unauthorized"});
    
        }

  });


  router.post('/deletediploma', async (req, res) => {

    const { pass } = req.body;
    const studentaccount = req.query.studentaccount;
    const coursesku = req.query.coursesku;

    if( pass == process.env.PASS_TO_AUTH){

            console.log("Autorized");

            const accounts = await web3.eth.getAccounts();

            try {

              const txn = await contractID3.methods.deleteDiploma(studentaccount, coursesku).send({ from: accounts[0] } );

              console.log("txn: ", txn);

              res.status(200).json({"Transaction url": `https://mumbai.polygonscan.com/tx/${txn.transactionHash}`});


            } catch (err) {

              res.status(500).send(err.toString());

            }

          } else {

            res.status(401).json({Error:"Unauthorized"});
    
        }

  });

  router.post('/deletestudentenrolled', async (req, res) => {

    const { pass } = req.body;
    const studentaccount = req.query.studentaccount;

    if( pass == process.env.PASS_TO_AUTH){

            console.log("Autorized");

            const accounts = await web3.eth.getAccounts();

            try {

              const txn = await contractID3.methods.deleteStudentEnrolled(studentaccount).send({ from: accounts[0] } );

              console.log("txn: ", txn);

              res.status(200).json({"Transaction url": `https://mumbai.polygonscan.com/tx/${txn.transactionHash}`});


            } catch (err) {

              res.status(500).send(err.toString());

            }

          } else {

            res.status(401).json({Error:"Unauthorized"});
    
        }

  });


  return router;
  
};