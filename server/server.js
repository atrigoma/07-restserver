require('./config/config');
const express = require('express')
const app = express()

const mongoose = require('mongoose')

const bodyParser = require('body-parser')

const port = process.env.PORT;

// El módulo "path" es propio de node. No hay que instalarlo.
const path = require('path');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

app.use(require('./routes/index'));

// Habilitamos visibilidad de la carpeta Public
app.use( express.static( path.resolve(__dirname, '../public')));

mongoose.connect(process.env.urlDB, 
    { useNewUrlParser: true, useCreateIndex: true},
    (err, res) =>{
    if (err) throw err;
    console.log('Base de datos ONLINE');
});


app.listen(port, () => {
    console.log(`Escuchando en el puerto ${port}`);
})