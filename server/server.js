const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const { ObjectID } = require('mongodb');

const { mongoose } = require('./db/mongoose');
const { Todo } = require('./models/todo');
const { User } = require('./models/user');

const app = express();

const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    var todo = new Todo({
        text: req.body.text
    });
    todo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
});

app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({ todos });
    }, (e) => {
        res.status(400).send(e);
    });
});

app.get('/todo/:id', (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        res.status(404).send();
    Todo.findById(req.params.id).then((todo) => {
        if (!todo) {
            res.status(404).send();
        }
        res.send({ todo });
    }).catch(() => res.status(400).send());
});

app.delete('/todo/:id', (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(404).send();
    Todo.findByIdAndRemove(req.params.id).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        }
        res.send({ todo });
    }).catch(() => res.status(400).send());
});

app.patch('/todo/:id', (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);
    if (!ObjectID.isValid(req.params.id))
        return res.status(404).send();

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();

    }
    else {
        body.completed = false;
        body.completedAt = null;
    }
    Todo.findByIdAndUpdate(id, { $set: body }, { new: true }).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        }
        res.send({ todo });
    }).catch((e) => res.status(400).send());
})

app.listen(port, () => {
    console.log('Started server');
});

module.exports = { app };