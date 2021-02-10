function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }

    res.redirect('auth/login')
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/')
    }
    next()
}

module.exports = {
    checkAuthenticated: function(req, res, next) {
        if (req.isAuthenticated()) {
            return next()
        }
    
        res.redirect('/auth/login')
    },

    checkNotAuthenticated: function (req, res, next) {
        if (req.isAuthenticated()) {
            return res.redirect('/')
        }
        next()
    }
}