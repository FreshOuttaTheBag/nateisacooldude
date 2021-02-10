const express = require('express');
const router = express.Router();
const db = require("../db/index.js");
const bc = require("bcrypt");
const passport = require('passport');
const { checkAuthenticated, checkNotAuthenticated } = require("../auth/auth-helpers")

let usercount;

router.get("/login", checkNotAuthenticated, (req, res) => {
    res.render('auth/login');
});

router.get("/register", checkNotAuthenticated, (req, res) => {
    try {
        db.query('SELECT COUNT(*) FROM "Users"', (err, response) => {
            if (err) {
                console.log(err.stack);
            }
            else {
                usercount = response.rows[0].count;
                res.render('auth/register', { usercount: usercount });
            }
        });
    }
    catch (e) {
        console.log(e);
    }
});

/*      Post Requests       */
router.post("/register", checkNotAuthenticated, async (req, res) => {
    try {
        const sql = 'SELECT * FROM public."RegisterUser"($1, $2) AS func_exit_code;';
        const hashedPassword = await bc.hash(req.body.password, 10);
        const vals = [req.body.username, hashedPassword]
        db.query(sql, vals, (err, response) => {
            if (err)
            {
                console.log(err);
                res.redirect("/auth/register")
            } else {
                const exit_code = response.rows[0].func_exit_code;
                if (exit_code == 200) { //200 being the response for "OKAY"
                    res.redirect("/auth/login");
                } else if (exit_code == 409) { //409 being the response for "CONFLICT"
                    req.flash('error', 'That username has already been taken');
                    res.redirect("register");
                }
            }
        });
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