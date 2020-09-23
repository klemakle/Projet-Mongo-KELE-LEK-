const bcrypt = require('bcryptjs');
const multer = require('multer');
const router = require('express').Router();
const jwt = require('jsonwebtoken')
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/jpg']
const { inscriptionValide, loginValide } = require('../models/valide')

//model
const User = require('../models/user');
const Pub = require('../models/pub');
const verification = require('../config/check_token')


//==================== sauvegarde de Profile ============================= 
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
    })
    //==================== sauvegarde de Profile =============================




if (typeof localStorage === "undefined" || localStorage === null) {
    const LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
}







//page d'authentification
router.get('/', async(req, res) => {
    let query = Pub.find()
    const plusPopulaires = await Pub.find().where('likes').gt(10)
    if (req.query.titre != null && req.query.title != '') {
        query = query.regex('titre', new RegExp(req.query.title, 'i'))
    }

    try {
        const pubs = await query.exec()
        var context = {
            publication: pubs,
            plusPopulaires: plusPopulaires
        }
        res.render('index', context)

    } catch (err) {
        console.log(err);
        res.send(err);;
    }

});







//Page d'inscription
router.post('/sign', upload.single('photo_profile'), async(req, res) => {

    const { error } = inscriptionValide(req.body);
    const errors = [];

    // Verifions d'abord les erreurs
    if (error) {
        errors.push({ message: error.details[0].message + "" });
    }

    //Verifions si un user avec le même username existe dans la base
    const usernameExist = await User.findOne({ username: req.body.username });
    if (usernameExist) {
        errors.push({ message: 'Nom d\'utilisateur déja utilisé' });
    }

    //Verifions si un user avec le même email existe dans la base
    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist) {
        errors.push({ message: "Email déjà utilisé ! " });
    }

    //Verifions si les mots de passe correspondent
    if (req.body.password !== req.body.password1) {
        errors.push({ message: "Les mots de passe ne correspondent pas !" });
    }

    // Hashons les mots de passe avec bcyprt
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    //Creons un User
    const utilisateur = new User({
        username: req.body.username,
        email: req.body.email,
        photo_profile: req.file.path,
        nom: req.body.nom,
        prenom: req.body.prenom,
        password: hashedPassword
    });

    try {
        console.log(errors)
        if (errors.length == 0) {
            const userValide = await utilisateur.save();
            res.redirect('login');
        } else {
            const context = { errors };
            res.render('register', context);
        }
    } catch (err) {
        const context2 = {
            errors,
            username: req.body.username,
            email: req.body.email,
            nom: req.body.nom,
            prenom: req.body.prenom
        };
        res.render('register', context2)
    }

})






//Page login
router.post('/login', async(req, res, next) => {
    const { error } = loginValide(req.body);
    const errors = [];
    if (error) errors.push({ message: error.details[0].message + "" })

    //verification de nom d'utilisateur
    const userLogged = await User.findOne({ username: req.body.username });
    if (!userLogged) {
        errors.push({ message: `Nom d\'utilisateur ou Mot de passe incorrect` });
        res.render('login', { errors });
    }

    //verification de mot de passe
    const mdpValide = await bcrypt.compare(req.body.password, userLogged.password)
    if (!mdpValide) errors.push({ message: 'Mot de passe incorrect' });

    //affectation de token
    const secretToken = require('../config/key').Secret;
    const token = jwt.sign({ _id: userLogged._id }, secretToken, { expiresIn: require('../config/key').JWT_EXPIRES });


    localStorage.setItem('auth-token', token)
    if (errors.length == 0) {
        res.redirect('/post/compte');
    } else {
        res.render('login', { errors });
    }
})




router.get('/logout', verification, (req, res) => {
    localStorage.removeItem('auth-token');
    console.log('deconnecté')
    res.redirect('/login');
});



module.exports = router;