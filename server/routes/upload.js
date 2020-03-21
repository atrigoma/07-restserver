
const express = require('express');
const fileupload = require('express-fileupload');
const User = require('../models/user');
const Product = require('../models/product');
const fs = require ('fs');
const path = require('path');

const app = express();




// Se carga con las opciones por defecto
app.use(fileupload());

app.put('/upload/:typeupload/:id', function(req, res) {
    let typeupload = req.params.typeupload;
    let id = req.params.id;

    
    if (!req.files){
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Doesnt files are selected'
            }
        })        
    }

    let tiposvalidos = ['products', 'users'];
    
    if (tiposvalidos.indexOf(typeupload) < 0){
        return res.status(400).json({
            ok: false,
            err: {
                message: 'The allowed types are: ' + tiposvalidos.join(', '),
                type: typeupload
            }
        })

    }

    // "namefile" es el nombre del parámetro en la petición (en el body)
    let auxfile = req.files.namefile;
    let arrayfile = auxfile.name.split('.');

    let extension = arrayfile[arrayfile.length - 1].toLowerCase();

    let name = arrayfile[0];

    let extensionespermitidas = ['jpg', 'jpeg', 'gif', 'png'];

    if (extensionespermitidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'The allowed extensions are ' + extensionespermitidas.join(', '),
                ext: extension
            }
        })
    }

    let nameFile = `${name}-${ new Date().getMilliseconds()}.${extension}`;
    auxfile.mv(`./uploads/${typeupload}/${nameFile}`, (err) => {
        if (err){
            return res.status(500).json({
                ok: false,
                err
            });
        }


        if (typeupload === "users"){
            imageUser(id, res, nameFile);
        }
        else{
            imageProduct(id, res, nameFile);
        }

    })


})


function imageUser (id, res, nameFile) {
    User.findById(id, (err, userDB) =>{
        if (err){
            deleteFile(nameFile, "users");
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!userDB){
            deleteFile(nameFile, "users");
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Doesnt exist the user'
                }
            });
        }

        let pathImage = path.resolve(__dirname, `../../uploads/users/${userDB.img}`);

        // Remove the previous image (if this exist)
        if (fs.existsSync(pathImage)){
            fs.unlinkSync(pathImage);
        }

        deleteFile(userDB.img, "users");

        userDB.img = nameFile;
        userDB.save( (err, userSaved) => {
            if (err){
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
    
            if (!userSaved){
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Doesnt exist the user'
                    }
                });
            }
            res.json({
                ok: true,
                user: userSaved,
                img: nameFile
            })
        });
    });

}


function imageProduct (id, res, nameFile) {
    Product.findById(id, (err, productDB) =>{
        if (err){
            deleteFile(nameFile, "products");
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productDB){
            deleteFile(nameFile, "products");
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Doesnt exist the product'
                }
            });
        }

        let pathImage = path.resolve(__dirname, `../../uploads/products/${productDB.img}`);

        // Remove the previous image (if this exist)
        if (fs.existsSync(pathImage)){
            fs.unlinkSync(pathImage);
        }

        deleteFile(productDB.img, "products");

        productDB.img = nameFile;
        productDB.save( (err, productSaved) => {
            if (err){
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
    
            if (!productSaved){
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Doesnt exist the product'
                    }
                });
            }
            res.json({
                ok: true,
                user: productSaved,
                img: nameFile
            })
        });
    });

}

function deleteFile (nameFile, typeFile) {

    let pathImage = path.resolve(__dirname, `../../uploads/${typeFile}/${nameFile}`);

    // Remove the previous image (if this exist)
    if (fs.existsSync(pathImage)){
        fs.unlinkSync(pathImage);
    }

}


module.exports = app;
