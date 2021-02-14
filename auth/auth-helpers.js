module.exports = {
    checkAuthenticated: function(req, res, next) {
        if (req.isAuthenticated()) {
            return next()
        }
        else if (req.xhr) { // if request is ajax call
            res.sendStatus('401')
        }
        else {
            res.redirect('/auth/login');
        }  
    },

    checkNotAuthenticated: function (req, res, next) {
        if (req.isAuthenticated()) {
            return res.redirect('/')
        }
        next()
    }
}