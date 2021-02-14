const express = require('express');
const router = express.Router();
const db = require("../db/index.js");
const { Post, User, PostLike } = require('../db/model');
const {checkAuthenticated, checkNotAuthenticated} = require('../auth/auth-helpers')
const validURL = require("valid-url");

/* get post and all posts */
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
    Post.findByPk(req.params.id, { include: "UsersThatLikedPost" })
    .then(async post => {
        if (post === null) {
            console.log("Post not found with id: "+req.params.id);
            res.sendStatus(404);
        } else {
            // this can be cleaned up by only requesting all posts, and then showing the showcased post based on the ID. Leaving for another day
            const posts_data = await Post.findAll({ order: [['id', 'DESC']], include: "UsersThatLikedPost" }).catch(err => console.log(err));
            const posts = posts_data.map(pst => { return pst.toJSON() });
            posts.forEach(post_data => {
                if (!validURL.isUri(post_data.url)){
                    post_data.url = '/pictures/image-not-found.png';
                }
            });
            if (!validURL.isUri(post.url)) {
                    post.url = '/pictures/image-not-found.png';
            }
            post.getUser().then(usr => {
                res.render("posts/post.ejs", {  
                    post,
                    posts,
                    postUserId: usr.id,
                    user: req.user
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

/* Edit Post */
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

/* Delete Post */
router.delete("/:id", checkAuthenticated, (req, res) => {
    Post.destroy({
        where: {
            id: req.params.id
        }
    })
    res.redirect("/");
})

async function numberOfPostLikes(postID) {
    return new Promise(async (resolve, reject) => {
        try {
            const post = await Post.findByPk(postID, { include: "UsersThatLikedPost" });
            resolve(post.UsersThatLikedPost.length);
        } catch (err) {
            reject(err);
        }
    });
}

/* Like Posts */
router.post("/like/:id", checkAuthenticated, (req, res) => {
    PostLike.create({ //could think of some way to use like or create but fuck man im tired
        user_id: req.user.id,
        post_id: req.params.id,
    })
    .then( async () => {
        const likeCount = await numberOfPostLikes(req.params.id);
        console.log(likeCount);
        res.status(201).send({ likeCount }); 
    })
    .catch(err => {
        console.log(err)
        res.sendStatus(500)
    });
});

router.delete("/like/:id", checkAuthenticated, async (req, res) => {
    PostLike.destroy({
        where: {
            user_id: req.user.id,
            post_id: req.params.id
        }
    })
    .then(async () =>  {
        const likeCount = await numberOfPostLikes(req.params.id);
        res.status(202).send({ likeCount });    
    })
    .catch(err => {
        console.log(err)
        res.sendStatus(500)
    });
});

router.get("/likes/:id", async (req, res) => {
    res.send({ likeCount: await numberOfPostLikes(req.params.id) });
});

router.get("/liked/:id", checkAuthenticated, (req, res) => {
    Post.findByPk(req.params.id, { include: "UsersThatLikedPost" } )
    .then(post => {
        res.send(post.UsersThatLikedPost.map(usr => usr.id).includes(req.user.id));
    })
})

module.exports = router;

