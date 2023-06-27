const { mintID3NFT } = require("./mintNFT.js");
const express = require('express');
const app = express();
const http = require('http');
const morgan = require('morgan');
const cors = require("cors");
const server = http.createServer(app);

require("dotenv").config();

app.set('port', process.env.PORT || 3000);
app.set('json spaces', 2);

//middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended : false}))
app.use(express.json());

const stateAPI = {

        "APIID3Status": "Overall Status OK",
        "MINTERSTATUS": "Minter Status OK" 
              
}

app.get('/', async(req,res) => {     
     
        let { APIID3Status } = stateAPI;
        res.send(APIID3Status);
  
    }) 

app.get('/mintID3Token', async(req,res) => {     

        console.log("recibido");

        let { MINTERSTATUS } = stateAPI;

        res.send(MINTERSTATUS);
    
    }) 


app.post('/mintID3Token', async(req, res) =>{
    
        const { pass } = req.body;
        const { courseSKU } = req.body;
        const { studentAccount } = req.body;
        const { courseDate } = req.body;
        const { tokenURI } = req.body;

        if( courseSKU == null || studentAccount == null || courseDate == null){

                res.status(400).json({Error:"Information not complete"});

        }   

        if(tokenURI == null){

                

        }

        if( pass == process.env.PASS_TO_AUTH){

    

                console.log("Autorized");
                
                const jsonToken = await mintID3NFT(wallet);

                res.status(200).json(jsonToken);
    
        } else {
    
            res.status(401).json({Error:"Unauthorized"});
    
        }

})

app.get('/setStudent', async(req,res) => {     

        console.log("recibido");

        res.send(stateid3minter);
        console.log(stateid3minter);
    
    }) 


app.post('/setStudent', async(req, res) =>{
    
        const { pass } = req.body;
        const { wallet } = req.body;

        if( pass == process.env.PASS_TO_AUTH){

                console.log("Autorized");
                
                const jsonToken = await mintID3NFT(wallet);

                res.status(200).json(jsonToken);
    
        } else {
    
            res.status(401).json({Error:"Unauthorized"});
    
        }

})
           

//Starting the server
server.listen(process.env.PORT || 3000, ()=> {

        console.log(`Server on port ${ app.get('port') }`)

})