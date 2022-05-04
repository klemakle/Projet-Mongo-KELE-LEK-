// module 
const express = require('express');
const app = express()
const mongoose = require('mongoose');





app.set('view engine', 'ejs');
app.set('views', __dirname + '/views/yummy');



//Connection à la base de données
const Port = require('./config/key').Port;
const db = require('./config/key').MongoURI;

mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: true })
    .then(() => {
        app.listen(Port, () => console.log(`le serveur a démarré sur le port ${Port}`));
        console.log("Connecté à la BD...");
    })
    .catch(err => console.log(err));



//body parser
app.use(express.urlencoded({ extended: false }));


app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));
app.use(express.json());


// routes
app.use('/post', require('./routes/pubCRUD'));
app.use('/', require("./routes/auth"));
app.use('/', require('./routes/accueil'));