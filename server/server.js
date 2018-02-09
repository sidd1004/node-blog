require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const { ObjectID } = require('mongodb');

const { mongoose } = require('./db/mongoose');
const { Blog } = require('./models/blog');
const { User } = require('./models/user');
const { authenticate } = require('./middleware/authenticate');

const app = express();

app.use(bodyParser.json());

app.post('/blogs', authenticate, (req, res) => {
    var blog = new Blog({
        content: req.body.content,
        _creator: req.user._id
    });
    blog.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
});

app.get('/blogs', authenticate, (req, res) => {
    Blog.find({ _creator: req.user._id }).then((blogs) => {
        res.send({ blogs });
    }, (e) => {
        res.status(400).send(e);
    });
});

app.get('/blog/:id', authenticate, (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        res.status(404).send();
    Blog.findOne(
        {
            _id: req.params.id,
            _creator: req.user._id
        }).then((blog) => {
            if (!blog) {
                res.status(404).send();
            }
            res.send({ blog });
        }).catch(() => res.status(400).send());
});

app.delete('/blog/:id', authenticate, (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(404).send();
    Blog.findOneAndRemove({
        _id: req.params.id,
        _creator: req.user.id
    }).then((blog) => {
        if (!blog) {
            return res.status(404).send();
        }
        res.send({ blog });
    }).catch(() => res.status(400).send());
});

app.patch('/blog/:id', authenticate, (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['content']);
    if (!ObjectID.isValid(req.params.id))
        return res.status(404).send();

    /* if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();

    }
    else {
        body.completed = false;
        body.completedAt = null;
    } */
    Blog.findOneAndUpdate({ _id: id, _creator: req.user.id }, { $set: body }, { new: true }).then((blog) => {
        if (!blog) {
            return res.status(404).send();
        }
        res.send({ blog });
    }).catch((e) => res.status(400).send());
});

app.post('/users', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    var user = new User(body);
    user.save().then(() => {
        return user.generateAuthToken()
    }).then((token) => {
        res.header('x-auth', token).send(user);
    }).catch((e) => {
        res.status(400).send(e);
    });
});


app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

app.post('/users/login', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    User.findByCredentials(body.email, body.password).then((user) => {
        return user.generateAuthToken().then((token) => {
            res.header('x-auth', token).send(user);
        });
        res.send(user);
    }).catch((e) => {
        res.status(400).send();
    });
});

app.delete('/users/me/token', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send();
    }, () => {
        res.status(400).send();
    });
});

app.listen(process.env.PORT, () => {
    console.log('Started server');
});

module.exports = { app };