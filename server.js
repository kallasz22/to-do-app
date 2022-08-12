//express
const express = require('express');
const app = express();

//mongoose
const mongoose = require('mongoose');
const config = require('./config.json');
mongoose.connect(`mongodb+srv://${config.dbUsername}:${config.dbPassword}@todolist.odaitow.mongodb.net/?retryWrites=true&w=majority`);

//body-parser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded());

//cookie-parser
const cookieParser = require('cookie-parser');
app.use(cookieParser());

//itemSema
const Item = require('./models/toDoItem');
const User = require('./models/user');
const Tag = require('./models/tag');

//hash
const bcrypt = require('bcrypt');

//login-auht -- session-token
const crypto = require('crypto');
const user = require('./models/user');

//oldalak lekérése expressben
app.use(express.static(__dirname + "/public"));

//új to-do item hozzáadása
app.post("/new-item", loginOnlyMiddleware, async function(req, res){
    const user =  req.user;

    let todo = {
        item: req.body.input,
        tag: req.body.tags
    }

    user.todos.push(todo);

    await user.save();
    res.redirect('/to-do.html');
});

app.get('/load', loginOnlyMiddleware, async function(req, res){
    const items = await req.user.todos;
    res.contentType('application/json').send(JSON.stringify(items));
});

app.post('/new-user', async function(req, res){
    const user = new User();
    user.username = req.body.username;

    //jelszó hash
    const hash = await bcrypt.hash(req.body.password, 10);
    user.password = hash;

    await user.save();
    res.redirect('/sign-in.html');
});

app.post('/login', async function(req, res){
    const user = await User.findOne({
        username: req.body.username
    });

    if (user) {
        const pwC = await bcrypt.compare(req.body.password, user.password);
        if (!pwC) {
            res.status(403).send('Wrong password');
            return;
        }

        const token = crypto.randomUUID();
        user.tokens.push(token);
        await user.save();

        res.cookie("session", token).redirect('/to-do.html');
    } else {
        res.status(404).send('No user with this username');
    }
});

async function loginOnlyMiddleware(req, res, next){
    const token = req.cookies.session;

    if (!token) {
        res.status(403).send('you arent logged in');
        return;
    }

    const user = await User.findOne({
        tokens: token
    });

    if (user) {
        req.user = user;
        next();
    } else {
        res.send(403).send('rossz token');
    }
}

app.get('/secret', loginOnlyMiddleware, function(req, res){
    res.send('be vagy jelentkezve');
});


app.get('*', function(req, res){
    res.status(404).end('404 : Not Found');
});

app.listen(80);