const express = require('express');
const router = express.Router();
const db = require("../db/index.js");
const { Post, User } = require('../db/model');
const {checkAuthenticated, checkNotAuthenticated} = require('../auth/auth-helpers')


router.get('/new', checkAuthenticated, (req, res) => {
    res.render('posts/new');
});

router.get('/:id', async (req, res) => {
    Post.findByPk(req.params.id)
    .then(async post => {
        if (post === null) {
            console.log("Post not found with id: "+req.params.id);
            res.sendStatus(404);
        } else {
            const posts_data = await Post.findAll({ order: [['id', 'DESC']] }).catch(err => console.log(err));
            res.render("posts/post.ejs", {  
                post,
                posts: posts_data.map(pst => { return pst.toJSON() })
            });
        }
    })
    .catch(err => console.log(err)); 
});

router.post('/', checkAuthenticated, (req, res) => {
    const { title, url, content } = req.body;
    Post.create({
        title,
        url,
        content,
        user_id: req.user.id,
    }).then(post => {
        res.redirect('/'+post.id)
    }).catch(err => console.log(err));
});

module.exports = router;

