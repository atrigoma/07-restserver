require('./config/config');

const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const port = process.env.PORT;
 
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())
 

app.get('/', function (req, res) {
  res.json('Hello World')
})

app.get('/user', function (req, res) {
    res.json('Get user')
  })
  
app.post('/user', function (req, res) {
    let body = req.body;

    if ( body.name === undefined) {
        res.status(400).json({
            ok: false,
            msg: 'The field name is necesary'
        });
    }
    else{
        res.json({persona: body});
    }

})
  
app.put('/user/:id', function (req, res) {
    let id= req.params.id;

    res.json(`put user ${id}`);
    })
    

app.delete('/user', function (req, res) {
    res.json('delete user')
    })
    

app.listen(port, () => {
    console.log(`Escuchando en el puerto ${port}`);
})