const express = require('express');
const router = express.Router();
const db = require("../db/index.js");
const slugify = require('slugify');

router.get('/new', (req, res) => {
    res.render('posts/new');
});

router.get('/:id', (req, res) => {
    const sql = 'SELECT "title","url","content" FROM "Posts" WHERE "id" = $1 LIMIT 1;';
    const values = [req.params.id];
    db.query(sql, values, (err, response) => {
        if (err) {
            console.log(err.stack);
        }
        else {
            const sql = 'SELECT "title", "url", "content", "id" FROM public."Posts" ORDER BY "id" DESC;';
            db.query(sql, (err, allPosts) => {
                if (err) {
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

router.post('/', (req, res) => {
    try {
        const sql = 'INSERT INTO "Posts" ("title", "url", "content") VALUES ($1, $2, $3);';
        const values = [req.body.title, req.body.url, req.body.content];
        
        db.query(sql, values, (err, res) => {
            if (err) {
                console.log(err.stack);
            }
        });
    }
    catch (e) {
        console.log(e);
    }
    res.redirect('/')
});

module.exports = router;

