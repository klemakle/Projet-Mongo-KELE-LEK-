const router = require('express').Router();
const Pub = require('../models/pub')
const User = require('../models/user')
const verification = require('../config/check_token')









router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/sign', (req, res) => {
    res.render('register');
});


module.exports = router;