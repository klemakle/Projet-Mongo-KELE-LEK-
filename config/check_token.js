const jwt = require('jsonwebtoken');


module.exports = function(req, res, next) {
    const token = localStorage.getItem('auth-token')
    if (!token) return res.status(401).redirect('/login')
    try {
        const secretToken = require('../config/key').Secret;
        const verifie = jwt.verify(token, secretToken, { expiresIn: '2 days' });

        req.userLogged = verifie;
        next();
    } catch (err) {
        res.status(400).send('Invalid token');
    }
};