const LocalStrategy = require("passport-local").Strategy;
const bcrpyt = require('bcrypt');
const db = require("../db/index.js");

async function getUserByUsername(username) {
    const sql = 'SELECT "id", "username", "hash" FROM "Users" WHERE "username" = $1'
    const vals = [username]
    return new Promise(resolve => {
        db.query(sql, vals, (err, response) => {
            if (err) {
                reject(err);
            } else {
                resolve(response.rows[0]);
            }
        })
    })
}

async function getUserById(id) {
    const sql = 'SELECT "id", "username", "hash" FROM "Users" WHERE "id" = $1'
    const vals = [id]
    return new Promise(resolve => {
        db.query(sql, vals, (err, response) => {
            if (err) {
                reject(err);
            } else {
                resolve(response.rows[0]);
            }
        })
    })
}

async function authenticateUser(username, password, done) {
    const user = await getUserByUsername(username);
    if (!user) {
        return done(null, false, { message: 'No user with that username' });
    }
    
    try {
        if (await bcrpyt.compare(password, user.hash)) {
            return done(null, user)
        } else {
            return done(null, false, { message: 'Password incorrect'})
        }
    } catch (e) {
        return done(e)
    }
}

function initialize(passport) {
    passport.use(new LocalStrategy({ usernameField: 'username' }, authenticateUser));
    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser(async (id, done) => {
        const user = await getUserById(id);
        return done(null, user);
    });
}

module.exports = initialize;