const mongoose = require('mongoose');

const userSema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    tokens: {
        type: [String]
    },
    todos: {
        type: [
            {
                item: {
                    type: String,
                    required: true
                },
                tag: {
                    type: String,
                }
            }
        ]
        
    },
    tags: {
        type: [String]
    }
});

module.exports = mongoose.model('user', userSema);