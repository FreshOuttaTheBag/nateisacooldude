const express = require('express');
const router = express.Router();
const db = require("../db/index.js");
const bc = require("bcrypt");
const passport = require('passport');
const { checkAuthenticated, checkNotAuthenticated } = require("../auth/auth-helpers")
const { User } = require('../db/model');

let usercount;

router.get("/login", checkNotAuthenticated, (req, res) => {
    res.render('auth/login');
});

router.get("/register", checkNotAuthenticated, async (req, res) => {
    User.findAndCountAll()
    .then(result => {
        res.render("auth/register", { usercount: result.count })
    })
    .catch(err => console.log(err));
});

/*      Post Requests       */
router.post("/register", checkNotAuthenticated, async (req, res) => {
    const hash = await bc.hash(req.body.password, 10);
    try {
        const [user, created] = await User.findOrCreate({
            where: { username: req.body.username },
            defaults: {hash}
        })
        if (created) {
            res.redirect("/auth/login");
        } else {
            req.flash('error', 'That username has already been taken');
            res.redirect("register");
        }
    } catch (e) {
        console.log(e)
    }    
});

router.post("/login", checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: 'login',
    failureFlash: true
}));

/* Delete Requests */
router.delete('/logout', (req, res) => {
    req.logout();
    res.redirect("login")
});


module.exports = router;