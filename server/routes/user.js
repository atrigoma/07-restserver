const express = require('express')
const app = express()
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const _ = require('underscore');
const { verifyToken, verifyAdminRole } = require('../middlewares/authentication');



  app.get('/user', verifyToken , (req, res) => {
    let from = req.query.from || 0;
    from = Number(from);
    
    let limit = req.query.limit || 5;
    limit = Number(limit);

    User.find({status:true}, 'name email role status google')
        .limit(limit)
        .skip(from)
        .exec((err, usuarios) => {

        if (err){
          return res.status(400).json({
              ok: false,
              err
          });    
        }

        User.count({status:true}, (err, count) =>{
          res.json({
            ok: true,
            usuarios,
            count
          })
        })
        
      });
    });
    
  app.post('/user', [verifyToken, verifyAdminRole] ,  function (req, res) {
      let body = req.body;

      let user = new User({
          name: body.name,
          email: body.email,
          password: bcrypt.hashSync( body.password,10 ),
          role: body.role
      })
  
      user.save( (err, userDB) => {
          if (err){
            return res.status(400).json({
                ok: false,
                err
            });    
          }

          return res.json({
              ok: true,
              user: userDB
          })
      })
    
  
  })
    
  app.put('/user/:id',[verifyToken, verifyAdminRole] ,  function (req, res) {
      let id= req.params.id;

      // Con la funcion pick de underscore, se selecciona los campos que se quieren utilizar.
      let body= _.pick(req.body, ['name', 'email', 'img', 'role', 'status']) ;
  
      User.findByIdAndUpdate( id, body, {new: true, runValidators: false} , (err, userDB) =>{

        if (err){
            return res.status(400).json({
                ok: false,
                err
            });
          }
          return res.json({
            ok: true,
            user: userDB

        })
      }) 
    })
      
  
  app.delete('/user/bbdd/:id', [verifyToken, verifyAdminRole] , function (req, res) {

    let paramid= req.params.id;
    let user = User.findByIdAndRemove ( paramid,  (err, userDB) =>{
      if (err){
        return res.status(400).json({
            ok: false,
            err
        });
      }

      if (!userDB){
          return res.status(400).json({
            ok: false,
            err: {
              message: `user ${paramid} not found`
            }
        });
      }


      return res.json({
        ok: true,
        user: userDB
      })
    })
  })

  app.delete('/user/:id', function (req, res) {

    let paramid= req.params.id;
console.log('Inside delete user');
    User.findById(paramid, (err, userDB) => {

      console.log('**********');

      if (err){
        return res.status(400).json({
            ok: false,
            err
        });    
      }

      if (!userDB){
        return res.status(400).json({
          ok: false,
          err: 'Doesnt exist user'
        });    

      }

      userDB.status=false;

      userDB.save( (err, userModifyDB) => {
        if (err){
          return res.status(400).json({
              ok: false,
              err
          });    
        }

        return res.json({
            ok: true,
            user: userModifyDB
        })
      })
    })
  })


module.exports=app;