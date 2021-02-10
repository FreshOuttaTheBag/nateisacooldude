const express = require('express');
const router = express.Router();
const db = require("../db/index.js");
const {checkAuthenticated, checkNotAuthenticated} = require('../auth/auth-helpers')

router.get('/new', checkAuthenticated, (req, res) => {
    res.render('posts/new');
});

router.get('/:id', (req, res) => {
    const sql = 'SELECT "title","url","content" FROM "Posts" WHERE "id" = $1 LIMIT 1;';
    const values = [req.params.id];
    db.query(sql, values, (err, response) => {
        if (err) {
            console.log("Error when retriving posts!");
            console.log(err.stack);
        }
        else {
            const sql = 'SELECT "title", "url", "content", "id" FROM public."Posts" ORDER BY "id" DESC;';
            db.query(sql, (err, allPosts) => {
                if (err) {
                    console.log("Error when retrieving posts!");
                    console.log(err.stack);
                }
                else {
                    res.render("posts/post.ejs", {  
                        post: response.rows[0],
                        posts: allPosts.rows
                    });
                }
            });
        }
    });
});

router.post('/', checkAuthenticated, (req, res) => {
    try {
        const sql = 'INSERT INTO "Posts" ("title", "url", "content", "user_id") VALUES ($1, $2, $3, $4);';
        const values = [req.body.title, req.body.url, req.body.content, req.user.id];
        
        db.query(sql, values, (err, res) => {
            if (err) {
                console.log("Error During POST");
                console.log(err.stack);
            }
        });
    }
    catch (e) {
        console.log("lol why are you posting")
        console.log(e);
    }
    res.redirect('/')
});

module.exports = router;

