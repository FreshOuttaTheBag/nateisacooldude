const express = require('express');
const router = express.Router();
const client = require("../db/init.js");

router.get('/new', (req, res) => {
    res.render('posts/new');
});

router.post('/', (req, res) => {
    try {
        client.connect()
        const sql = 'INSERT INTO "Posts" ("title", "url", "content") VALUES ("$1", "$2", "$3");';
        const values = [req.body.title, req.body.url, req.body.content];
        client.query(sql, values, (err, res) => {
            if (err) {
                console.log(err.stack);
            }
            client.end();
        });
    }
    catch (e) {
        console.log(e);
    }
    
});

module.exports = router;

