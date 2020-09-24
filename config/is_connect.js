module.exports = function(req, res, next) {
    const tok = localStorage.getItem('auth-token')
    if (!tok) return next()
    try {
        if (tok) res.redirect('/');
    } catch (e) {
        console.log(e)
    }


}