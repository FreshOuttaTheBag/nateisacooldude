const express = require("express");
const bp = require("body-parser");
const app = express();
//const port = process.env.PORT || 3000;
const port = 8000;
const path = require('path');

app.use(express.static('public'));
app.use(bp.json());

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html')
});

app.listen(port, async function() {
    console.log(`Example app listening at http://localhost:${port}`);
});