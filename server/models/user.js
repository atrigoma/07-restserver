const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


let Schema = mongoose.Schema;

let rolesEnum = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un role válido'
};

let userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'The name is mandatory']
    },
    email: {
        type: String,
        unique: true,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    img:{
        type: String,
        require: false
    },
    role:{
        type: String,
        require: true,
        default: 'USER_ROLE',
        enum: rolesEnum

    },
    status:{
        type: Boolean,
        default: true
    },
    google:{
        type: Boolean,
        default: false
    }
});

userSchema.plugin(uniqueValidator, {message: '{PATH} debe de ser único'});

// Con esto conseguimos que no se devuelva la password al recuperar un objeto.
userSchema.methods.toJSON = function() {
    let internalUser = this;
    let userObject = internalUser.toObject();
    delete userObject.password;

    return userObject; 
}

module.exports = mongoose.model('user', userSchema);