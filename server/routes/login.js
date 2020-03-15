const express = require('express')
const app = express()
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');



app.post('/login', (req, res) =>{

    let body = req.body;

    User.findOne({email : body.email}, (err, userDB) => {

        if (err){
            return res.status(500).json({
                ok: false,
                err
            })
        }
    
        if (!userDB){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'USER or pass not correct'
                }
            })
        }


        if ( bcrypt.compareSync( body.pass, userDB.password )){

            // Expire in 30 days: 60*60*24*30
            let token = jwt.sign({
                user: userDB
            }, process.env.SEED_TOKEN, {expiresIn: process.env.EXPIRE_TOKEN});

            return res.json({
                ok:true,
                token
            });   
        }
        else{
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'User or PASS not correct'
                }
            })

        }
    
    });

})


module.exports=app;