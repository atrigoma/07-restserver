const express = require('express');
const fs = require('fs');
const path = require('path');
const { verifyTokenURL } = require('../middlewares/authentication');

let app = express();


app.get('/image/:typeimage/:img', verifyTokenURL, (req, res) => {

    let typeimage = req.params.typeimage;
    let img = req.params.img;

    let pathImage = path.resolve(__dirname, `../../uploads/${typeimage}/${img}`);

    if (fs.existsSync(pathImage)){
        res.sendFile(pathImage);
    }
    else{
        pathImage = path.resolve(__dirname, `../../server/assets/noimage.jpg`);
        res.sendFile(pathImage);
    }

})



module.exports=app;