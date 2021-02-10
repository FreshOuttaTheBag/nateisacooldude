require('dotenv').config()
const express = require("express");
const app = express();
const articleRouter = require('./routes/posts');
const authRouter = require('./routes/auth');
const db = require("./db/index.js");
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

const port = 8000 || process.env.PORT;

app.get('/', (req, res) => {
    try {
        const sql = 'SELECT "title", "url", "content", "id" FROM public."Posts" ORDER BY "id" DESC;';
        db.query(sql, (err, response) => {
            if (err) {
                console.log(err.stack);
            }
            else {
                let user = undefined;
                if (req.isAuthenticated())
                {
                    user = req.user;
                }
                res.render('posts/index', { posts: response.rows, user: user } );
            }
        });
    }
    catch (e) {
        console.log(e);
    }
});

app.listen(port, async function() {
    console.log(`Example app listening at http://localhost:${port}`);
});





