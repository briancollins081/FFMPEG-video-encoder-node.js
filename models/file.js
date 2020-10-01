const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const filesSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    path:{
        type: String,
        required: true
    },
    generated:{
        type: String,
        required: true
    },
    thumbnail:{
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model('File', filesSchema);