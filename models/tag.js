const mongoose = require('mongoose');

const tagSema = new mongoose.Schema({
    tag: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('tag', tagSema);