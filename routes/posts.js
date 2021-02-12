const express = require('express');
const router = express.Router();
const db = require("../db/index.js");
const { Post, User } = require('../db/model');
const {checkAuthenticated, checkNotAuthenticated} = require('../auth/auth-helpers')
const validURL = require("valid-url");


router.get('/new', checkAuthenticated, (req, res) => {
    res.render('posts/new',{
        post: {
            title: '',
            url: '',
            content: '',
        }
    });
});

router.get('/:id', async (req, res) => {
    Post.findByPk(req.params.id)
    .then(async post => {
        if (post === null) {
            console.log("Post not found with id: "+req.params.id);
            res.sendStatus(404);
        } else {
            const posts_data = await Post.findAll({ order: [['id', 'DESC']] }).catch(err => console.log(err));
            const posts = posts_data.map(pst => { return pst.toJSON() });
            posts.forEach(post_data => {
                if (!validURL.isUri(post_data.url)){
                    post_data.url = '/pictures/image-not-found.png';
                }
            });
            if (!validURL.isUri(post.url)) {
                    post.url = '/pictures/image-not-found.png';
            }

            let pageUserId = null;
            if (req.user) {
                pageUserId = req.user.id
            }

            let postUserId = undefined;
            post.getUser().then(usr => {
                postUserId = usr.id;
                res.render("posts/post.ejs", {  
                    post,
                    posts,
                    postUserId,
                    pageUserId,
                    isEdit: false,
                });
            })
            .catch(err => console.log(err));
        }
    })
    .catch(err => console.log(err)); 
});

router.post('/', checkAuthenticated, (req, res) => {
    let { title, url, content } = req.body;
    if (!validURL.isUri(url)) {
        url = '/pictures/image-not-found.png';
    }
    Post.create({
        title,
        url,
        content,
        user_id: req.user.id,
    }).then(post => {
        res.redirect('/posts/'+post.id)
    }).catch(err => console.log(err));
});

router.get('/edit/:id/', checkAuthenticated, (req, res) => {
    Post.findByPk(req.params.id)
    .then(post => {
        const{ id, title, url, content } = post;
        res.render('posts/edit', {
            post: {
                id,
                title,
                content,
                url,
            }
        })
    })
    .catch(err => console.log(err));
});

router.put('/:id', checkAuthenticated, (req, res) => {
    let { title, content, url } = req.body;
    Post.findByPk(req.params.id)
    .then(async post => {
        post.title = title;
        post.content = content;
        if (!validURL.isUri(url)) {
            url = '/pictures/image-not-found.png';
        }
        post.url = url;
        await post.save();
        res.redirect('/posts/'+req.params.id);
    })
    .catch(err => console.log(err));
    
})

router.delete("/:id", checkAuthenticated, (req, res) => {
    Post.destroy({
        where: {
            id: req.params.id
        }
    })
    res.redirect("/");
})

module.exports = router;

