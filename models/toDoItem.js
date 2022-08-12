const mongoose = require('mongoose');

const itemSema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    tag: {
        type: String
    }
});

module.exports = mongoose.model('text', itemSema);