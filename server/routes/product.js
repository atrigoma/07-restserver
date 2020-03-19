
const express = require('express')
const app = express()
const Product = require('../models/product');
const { verifyToken } = require('../middlewares/authentication');


app.get('/product', verifyToken, (req, res) =>{

    let from = req.query.from || 0;
    from = Number(from);
    
    let limit = req.query.limit || 5;
    limit = Number(limit);

    Product.find({status:true}, 'name email role status google')

    console.log('product get');

    Product.find({})
    .sort('name')
    .limit(limit)
    .skip(from)
    .populate('user', 'name email')
    .populate('category', 'name description')
    .exec((err, products) => {

    if (err){
      return res.status(500).json({
          ok: false,
          err
      });    
    }

    Product.count({}, (err, count) =>{
      res.json({
        ok: true,
        products,
        count
      })
    })
    
  });

})

app.get('/product/:id', verifyToken, (req, res) =>{
  let id= req.params.id;
  Product.findById(id)
    .populate('user', 'name email')
    .populate('category', 'name description')
    .exec((err, productDB) => {
        console.log('**********');
        if (err){
        return res.status(500).json({
            ok: false,
            err
        });    
        }
        if (!productDB){
            return res.status(400).json({
                ok: false,
                err: {
                message: 'Product doesnt exist'
                }
            });    
        }

        return res.json({
            ok: true,
            product: productDB
        })
    })
  });


  app.get('/product/find/:term', verifyToken, (req, res) =>{
    let term= req.params.term;
    // Con la "i" indicamos que no sea sensible a mayúsculas y minúsculas
    let regex = new RegExp(term, 'i');


    Product.find({name: regex})
      .populate('category', 'name description')
      .exec((err, productsDB) => {
          if (err){
          return res.status(500).json({
              ok: false,
              err
          });    
          }
          if (!productsDB){
              return res.status(400).json({
                  ok: false,
                  err: {
                  message: 'Product doesnt exist'
                  }
              });    
          }
  
          return res.json({
              ok: true,
              products: productsDB
          })
      })
    });
  

// incluir middleware "verifyToken"
app.post('/product', verifyToken, (req, res) =>{
   
    console.log('product post');

    let userID= req.user._id; 
    let body = req.body;

    let product = new Product({
        name: body.name,
        description: body.description,
        priceUnit: body.priceUnit,
        disponible: true,
        category: body.category,
        user: userID
    })

    product.save( (err, productDB) => {
        if (err){
          return res.status(500).json({
              ok: false,
              err
          });    
        }

        if (!productDB){
          return res.status(400).json({
            ok: false,
            err: {
              message: 'Error to create product'
            }
          });    
        }

        return res.json({
            ok: true,
            product: productDB
        })
    })

})



app.put('/product/:id', verifyToken, (req, res) =>{

    console.log('product put');
    let id= req.params.id;

    // Con la funcion pick de underscore, se selecciona los campos que se quieren utilizar.
    let body= req.body;

    let productUpdate = {
      name: body.name,
      description: body.description,
      priceUnit: body.priceUnit
    }

    Product.findByIdAndUpdate( id, productUpdate, {new: true, runValidators: false} , (err, productDB) =>{

      if (err){
          return res.status(500).json({
              ok: false,
              err
          });
      }

      if (!productUpdate){
        return res.json({
          ok: true,
          err: {
            message: `Doesnt modify product with id ${id}`
          }
        })
      }

      return res.json({
          ok: true,
          product: productDB

      })
    }) 
})


app.delete('/product/:id', verifyToken, (req, res) =>{
// Solo la puede borrar un administrador
// Se tiene que eliminar la categoría físicamente
    console.log('product delete');

    let id= req.params.id;

    // Con la funcion pick de underscore, se selecciona los campos que se quieren utilizar.
    let body= req.body;

    let productUpdate = {
        disponible: false
    }

    Product.findByIdAndUpdate( id, productUpdate, {new: true, runValidators: false} , (err, productDB) =>{

      if (err){
          return res.status(500).json({
              ok: false,
              err
          });
      }

      if (!productUpdate){
        return res.json({
          ok: true,
          err: {
            message: `Doesnt modify product with id ${id}`
          }
        })
      }

      return res.json({
          ok: true,
          product: productDB
      })
    }) 
})


module.exports=app;
