require('dotenv').config()
const express = require("express");
const app = express();
const articleRouter = require('./routes/posts');
const authRouter = require('./routes/auth');

const favicon = require("serve-favicon");
const methodOverride = require("method-override");

const passport = require('passport')
const initializePassport = require('./auth/passport-config');
initializePassport(passport)
const flash = require('express-flash');
const session = require('express-session')
app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(methodOverride('_method'))
app.use(express.urlencoded({extended: false}));
app.use(express.static('public'))
app.use(favicon('./public/icon.gif'));
app.set('view engine', 'ejs');

app.use('/posts', articleRouter);
app.use('/auth', authRouter);

const db = require("./db/index.js");
const { Post, User, PostLikes } = require('./db/model');

app.get('/', (req, res) => {
    Post.findAll({ order: [['id', 'DESC']], include: "UsersThatLikedPost" })
    .then(posts => {
        let user = undefined;
        if (req.isAuthenticated())
        {
            user = req.user;
        }
        res.render('posts/index', { posts, user});
    })
    .catch(err => console.log(err));
});

const port = (8000 || process.env.PORT);
app.listen(port, async function() {
    console.log(`Example app listening at http://localhost:${port}`);
});





