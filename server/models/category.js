const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let categorySchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: [true, 'The name is mandatory']
    },
    description: {
        type: String,
        required: [true, 'The description is mandatory']
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: false
    },

});

categorySchema.plugin(uniqueValidator, {message: '{PATH} debe de ser único'});


module.exports = mongoose.model('category', categorySchema);