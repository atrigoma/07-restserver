const express = require('express')
const app = express()
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);


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


// *****************************************
// Configuration of google
// *****************************************

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();

    console.log(payload.name);
    console.log(payload.email);
    console.log(payload.picture);

    return {
        name: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}



app.post('/google', async (req, res) =>{
    
    console.log('Dentro google *************');

    let token = req.body.idtoken;

    console.log('**********************');
    console.log(token);
    console.log('**********************');

    let googleUser = await verify(token)
        .catch( (err) => {
            return res.status(403).json({
                ok: false,
                err
            })
        })

    User.findOne({email: googleUser.email}, (err, userDB) =>{
        if (err){
            return res.status(500).json({
                ok: false,
                err
            })
        }
        // Es un usuario de BBDD
        if (userDB){
            // No se ha autenticado por google
            if (!userDB.google) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'User has to logging by credentials'
                    }
                    
                })
    
            }
            else{
                // Se ha autenticado previamente por google
                let token = jwt.sign({
                    user: userDB
                }, process.env.SEED_TOKEN, {expiresIn: process.env.EXPIRE_TOKEN});
                return res.json({
                    ok: true,
                    user: userDB,
                    token
                })
    
            }

        }
        // NO existe usuario en la BBDD, por lo que le damos de alta.
        else{
            let user = new User();
            user.name = googleUser.name;
            user.email = googleUser.email;
            user.google = true;
            user.img = googleUser.img;
            user.password= 'default';

            user.save( (err, userDB) => {
                if (err){
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                let token = jwt.sign({
                    user: userDB
                }, process.env.SEED_TOKEN, {expiresIn: process.env.EXPIRE_TOKEN});
                return res.json({
                    ok: true,
                    user: userDB,
                    token
                })

            });

        }
    })
});


module.exports=app;