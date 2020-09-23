const mongoose = require('mongoose');

var userSchema = new mongoose.Schema({

    username: {
        type: String,
        min: 6,
        required: true
    },

    photo_profile: {
        type: String,
        required: false
    },

    email: {
        type: String,
        required: true,
    },

    nom: {
        type: String,
        required: true
    },

    prenom: {
        type: String,
        min: 9,
        required: true
    },

    password: {
        type: String,
        required: true
    }
})


module.exports = mongoose.model('user', userSchema);;