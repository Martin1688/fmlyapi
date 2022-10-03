
const app = require('https');

const verifyReCaptcha  = (req, res) => {
    let token = req.body.recaptcha;
    const version = req.body.version;
    const secretKey = version ==='v2' ? "6LdzsQMgAAAAAHdj2OofLejqgX2-FdnqlB4CpU3o":"6Lc1mhQhAAAAACP7xLOCuZFSTzkr_Ten2sd9XJII"; //the secret key from your google admin console;
    
   
    const url =  `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}&remoteip=${req.connection.remoteAddress}`
     
     //console.log(url);
    //note that remoteip is the users ip address and it is optional
    // in node req.connection.remoteAddress gives the users ip address
    
    if(token === null || token === undefined){
      res.status(201).send({success: false, message: "Token is empty or invalid"})
      return console.log("token empty");
    }
    
    app.get(url,(response)=>{
        //console.log(response);
        response.on('data', chunk => {
            const info = JSON.parse(chunk);
            if(info.success){
                res.status(200).send({"success": true, 'message': "recaptcha passed"});
            } else{
                res.status(201).send({success: false, 'message': "recaptcha 驗證失敗無法執行"}); 
            }
            console.log(info);
          });
        //   response.on('end', () => {
        //     console.log('done');
        //   });
    }).on('error', err => {
        console.log('Error: ', err.message);
        res.status(202).send({success: false, 'message':  err.message}); 
    });
  
  }

module.exports = {
    verifyReCaptcha
}