const router = require('express').Router();
const Pub = require('../models/pub')
const User = require('../models/user')
const verification = require('../config/check_token')

const est_connecte = require('../config/is_connect');







router.get('/login', est_connecte, (req, res) => {
    res.render('login');
});

router.get('/sign', est_connecte, (req, res) => {
    res.render('register');
});


module.exports = router;