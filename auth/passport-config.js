const LocalStrategy = require("passport-local").Strategy;
const bcrpyt = require('bcrypt');
const { User } = require("../db/model");

async function getUserByUsername(username) {
    return new Promise(async (resolve,reject) => {
        try 
        {
            const user = await User.findOne({ where: { username } })
            resolve(user);
        } catch (err) {
            console.log(err);
            reject(err);
        }
    })
}

async function getUserById(id) {
    return new Promise(async (resolve,reject) => {
        try 
        {
            const user = await User.findByPk(id)
            resolve(user);
        } catch (err) {
            console.log(err);
            reject(err);
        }
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