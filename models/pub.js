const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({


    titre: {
        type: String,
        max: 100,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    auteur: {
        type: String,
        default: 'anonyme'
    },
    
    date_post: {
        type: Date,
        default: Date.now
    },

    image_pub: {
        type: String,
        required: true
    },

    categories: [{
        type: String,
        required: false
    }],

    likes: {
        type: Number,
        default: 0
    },

    ingredients: [{
        body: {
            type: String
        },
        required: false
    }],

    comments: [{
        body: {
            type: String
        },
        auteur_com: {
            type: String,
        },
        date_com: {
            type: Date,
            default: Date.now
        },
        required: false
    }]
});




module.exports = mongoose.model('Pub', postSchema);