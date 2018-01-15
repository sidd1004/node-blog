const { ObjectID } = require('mongodb');

const jwt = require('jsonwebtoken');

const { Todo } = require('../../models/todo');
const { User } = require('../../models/user');

const userOneId = new ObjectID();
const userSecondId = new ObjectID();
const users = [{
    _id: userOneId,
    email: 'sid@sids.com',
    password: 'passes123',
    tokens: [{
        access: 'auth',
        token: jwt.sign({ _id: userOneId, access: 'auth' }, 'secret').toString()
    }]
}, {
    _id: userSecondId,
    email: 'sid1@sids.com',
    password: '123passes'
}];

const todos = [{
    _id: new ObjectID(),
    text: "First todo"
}, {
    _id: new ObjectID(),
    text: "Second todo",
    completed: true,
    completedAt: 333
}];

const populateTodos = (done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done());
};

const populateUsers = (done) => {
    User.remove({}).then(() => {
        var userOne = new User(users[0]).save();
        var userTwo = new User(users[1]).save();
        return Promise.all([userOne, userTwo]);
    }).then(() => done());
}
module.exports = { todos, populateTodos, users, populateUsers };