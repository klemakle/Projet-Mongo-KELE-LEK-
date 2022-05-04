const router = require('express').Router();
const mongoose = require('mongoose');
const multer = require('multer');
const jwt = require('jsonwebtoken')


//======================     Configuration stockage d'images    ==========================
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads');
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname);

    }
})

const fileFilter = function(req, file, cb) {
    if (!(imageMimeTypes.includes(file.mimetype))) {
        req.fileValidationError = 'goes wrong on the mimetype';
        return cb(null, false, new Error('goes wrong on the mimetype'));
    }
    cb(null, true);
}


const upload = multer({
    storage: storage,

    limits: {
        fileSize: 1024 * 1024 * 10
    },
    fileFilter: fileFilter
});
// ========================     Fin de configuration    =====================


//importation des modeles
const Pub = require('../models/pub');
const user = require('../models/user');

////verification d'authentification
const verification = require('../config/check_token');




//=================================================================== POST ====================================================



//toutes les pub dans archive
router.get('/archive', verification, async(req, res) => {
    let query = Pub.find()
    const utilisateur = await user.findOne({ '_id': req.userLogged._id })
    if (req.query.titre != null && req.query.title != '') {
        query = query.regex('titre', new RegExp(req.query.title, 'i'))
    }

    try {
        const pubs = await query.exec()
        var context = { publication: pubs, user: utilisateur }
        res.render('archive', context)

    } catch (err) {
        console.log(err);
        res.redirect('/');
    }
});





//creer une publication
router.post('/archive', upload.single('image_pub'), async(req, res) => {
    const ingred = await req.body.ingredients.split(";")
    const pub = new Pub({
        _id: new mongoose.Types.ObjectId(),
        titre: req.body.titre,
        description: req.body.description,
        auteur: req.body.auteur,
        categories: req.body.categorie,
        image_pub: req.file.path
    })

    ingred.forEach(ing => {
        pub.ingredients.push({ body: ing });
    });

    pub
        .save()
        .then(result => {
            res.redirect(`/post/single/${pub._id}`)
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});





// afficher tous les post ( accueil )
router.get('/', async(req, res) => {
    let query = Pub.find().where('likes').gt(3)
    if (req.query.titre != null && req.query.title != '') {
        query = query.regex('titre', new RegExp(req.query.title, 'i'))
    }

    try {
        const pubs = await query.exec()
        var context = { publication: pubs }
        res.render('index', context)
    } catch (err) {
        console.log(err);
        res.redirect('/login');
    }


});




///%%%%%%%%%%%%%%%%%%%%%%%%%%%%%    Single  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

// afficher un seul post
router
    .get('/single/:id', verification, async(req, res) => {
        const utilisateur = await user.findOne({ '_id': req.userLogged._id })
        const popularPost = await Pub.find().where('likes').gt(5)

        let id_pub = req.params.id
        try {
            var publica = await Pub.findById(id_pub)
            var pub_du_meme_auteur = await Pub.find({ 'auteur': publica.auteur })
            if (publica) {
                //console.log(publica)
            } else res.send('pas did')
        } catch (error) {
            console.log(error);
            res.status(500).send(error);
        }
        const context = {
            singlePost: publica,
            popularPost: popularPost,
            user: utilisateur,
            pub_du_meme_auteur
        }

        res.render('single', context);

    })
    .post('/single/:id', verification, async(req, res) => {
        const utilisateur = await user.findOne({ '_id': req.userLogged._id })
        const popularPost = await Pub.find().where('likes').gt(5)
        let id_pub = req.params.id
        const comment = req.body.commentaire
        try {
            var publica = await Pub.findByIdAndUpdate(id_pub).populate("comments")
            if (publica) {
                publica.comments.push({ body: comment, auteur_com: utilisateur.username })
                publica.save()
            } else res.send('pas d\'id')
        } catch (error) {
            console.log(error);
            res.status(500).redirect(`/post/single/${id_pub}`);
        }

        res.redirect(`/post/single/${publica._id}`);

    })
    ///%%%%%%%%%%%%%%%%%%%%%%%%%%%%%    Single  post a comment  %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%



//Compte de l'utilisateur
router.get('/compte', verification, async(req, res) => {
    const utilisateur = await user.findOne({ '_id': req.userLogged._id })
    const mesPubs = await Pub.find({ 'auteur': utilisateur.username })
    try {
        if (utilisateur) {
            const context = {
                user: utilisateur,
                pubPerso: mesPubs
            }
            res.render('contact', context);
        }
    } catch (e) {
        console.log(e)
        res.send('error')
    }

})

//Publier à partir de son compte
router.post('/compte', upload.single('image_pub'), async(req, res) => {
    const ingred = await req.body.ingredients.split(";")
    const categorie = await req.body.categorie
    const pub = new Pub({
        _id: new mongoose.Types.ObjectId(),
        titre: req.body.titre,
        description: req.body.description,
        auteur: req.body.auteur,
        categories: categorie,
        image_pub: req.file.path
    })

    ingred.forEach(ing => {
        pub.ingredients.push({ body: ing });
    });


    pub
        .save()
        .then(result => {
            res.redirect(`/post/single/${pub._id}`)
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});


//modifier un post
router.get('/update/:id', verification, async(req, res) => {
    const id_pub = req.params.id;
    const pub = await Pub.findOne({ '_id': id_pub })
    if (pub) {
        const nombre_ingredients = pub.ingredients.length;
        const tous_les_ingredients = [];
        pub.ingredients.forEach(ing => {
            tous_les_ingredients.push(ing.body)
        })
        return res.render('static', { pub_a_changer: pub, tli: tous_les_ingredients })
    } else {
        console.log(pub)
    }
});





//obtenir les publications par categorie
router.get('/categorie/:tag', verification, async(req, res) => {
    const tag = req.params.tag

    try {
        const pub_de_meme_categorie = await Pub.find({ 'categories': tag })
        if (pub_de_meme_categorie) {
            res.render('categories', { pub_de_meme_categorie: pub_de_meme_categorie, categorie: tag });
        }
    } catch (e) {
        res.send(e);
    }
});




router.get('/categ', verification, (req, res) => {

    res.render('categ')
});






//Modifier un post
router.post('/update/:id', verification, (req, res) => {
    const id_pub = req.params.id;

    Pub.findByIdAndUpdate(id_pub, { titre: req.body.titre }, err => {
        if (err) return res.send(500, err)

        res.redirect(`/post/single/${id_pub}`);
    })

});


//supprimer un post
router.get('/single/:id/supprimer', verification, (req, res) => {
    const auteur_du_post = Pub.findOne({ 'auteur': req.userLogged.username })
        //console.log(auteur_du_post)

    if (auteur_du_post) {
        let id_pub = req.params.id;
        Pub.findByIdAndRemove(id_pub, err => {
            if (err) return res.send(500, err);
            else {
                console.log('publication supprimée');
                res.redirect('/post/compte');
            }
        })
    } else {
        const impossible = 'vous ne pouvez pas supprimer cette publication';
        res.render('single', { impo: impossible });
    }

});






module.exports = router;