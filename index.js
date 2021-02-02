require('dotenv').config()
const express = require("express");
const bp = require("body-parser");
const app = express();
const articleRouter = require('./routes/posts');
const port = 8000;
const bc = require('bcrypt');
const client = require("./db/init.js");

app.use(express.urlencoded({extended: false}));
app.use(bp.json());
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    try {
        const sql = 'SELECT "title", "url", "content" FROM public."Posts";';
        client.query(sql, (err, response) => {
            if (err) {
                console.log(err.stack);
            }
            else {
                console.log(response.rows)
                res.render('posts/index', { posts: response.rows } );
            }
        });
    }
    catch (e) {
        console.log(e);
    }
});

app.post('/users', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.has(req.body.password, 10);
        console.log(salt);
        console.log(hashedPassword);
    }
    catch
    {
        res.status(500).send();
    }
});

app.post('/users/login', async (req, res) => {
    /* const user = users.find(user => user.name === req.body.name)
    if (user == null) {
        return res.status(400).send('Cannot find user')
    }
    try {
        if(await bcrypt.compare(req.body.password, user.password)) {
            res.send("Success");
        }
        else {
            res.send("Not allowed");
        }
    }
    catch {
        res.status(500).send();
    }*/
});

app.use('/posts', articleRouter); 

app.listen(port, async function() {
    console.log(`Example app listening at http://localhost:${port}`);
});



