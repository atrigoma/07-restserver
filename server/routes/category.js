const express = require('express')
const app = express()
const Category = require('../models/category');
const { verifyToken, verifyAdminRole } = require('../middlewares/authentication');

app.get('/category', verifyToken, (req, res) =>{

    console.log('category get');

    Category.find({})
    .sort('name')
    .populate('user', 'name email')
    .exec((err, categories) => {

    if (err){
      return res.status(400).json({
          ok: false,
          err
      });    
    }

    Category.count({}, (err, count) =>{
      res.json({
        ok: true,
        categories,
        count
      })
    })
    
  });

})

app.get('/category/:id', verifyToken, (req, res) =>{
  let id= req.params.id;
  Category.findById(id)
  .populate('user', 'name email')
  .exec((err, categoryDB) => {
    console.log('**********');
    if (err){
      return res.status(500).json({
          ok: false,
          err
      });    
    }
    if (!categoryDB){
      return res.status(400).json({
        ok: false,
        err: {
          message: 'Category doesnt exist'
        }
      });    
    }

  });
});

// incluir middleware "verifyToken"
app.post('/category', verifyToken, (req, res) =>{


    
    console.log('category post');

    let userID= req.user._id; 
    let body = req.body;

    let category = new Category({
        name: body.name,
        description: body.description,
        user: userID
    })

    category.save( (err, categoryDB) => {
        if (err){
          return res.status(500).json({
              ok: false,
              err
          });    
        }

        if (!categoryDB){
          return res.status(400).json({
            ok: false,
            err: {
              message: 'Error to create category'
            }
          });    
        }

        return res.json({
            ok: true,
            category: categoryDB
        })
    })

})



app.put('/category/:id', verifyToken, (req, res) =>{

    console.log('category put');
    let id= req.params.id;

    // Con la funcion pick de underscore, se selecciona los campos que se quieren utilizar.
    let body= req.body;

    let categoryUpdate = {
      name: body.name,
      description: body.description
    }

    Category.findByIdAndUpdate( id, categoryUpdate, {new: true, runValidators: false} , (err, categoryDB) =>{

      if (err){
          return res.status(400).json({
              ok: false,
              err
          });
      }

      if (!categoryUpdate){
        return res.json({
          ok: true,
          err: {
            message: `Doesnt modify category with id ${id}`
          }
        })
      }

      return res.json({
          ok: true,
          category: categoryDB

      })
    }) 
})


app.delete('/category/:id', [verifyToken, verifyAdminRole], (req, res) =>{
// Solo la puede borrar un administrador
// Se tiene que eliminar la categoría físicamente
    console.log('category delete');

    let id= req.params.id;
    let category = Category.findByIdAndRemove ( id,  (err, categoryDB) =>{
      if (err){
        return res.status(400).json({
            ok: false,
            err
        });
      }

      if (!categoryDB){
          return res.status(400).json({
            ok: false,
            err: {
              message: `category ${id} not found`
            }
        });
      }
      return res.json({
        ok: true,
        category: categoryDB
      })
    })
})


module.exports=app;