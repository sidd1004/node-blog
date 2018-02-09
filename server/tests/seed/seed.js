const { ObjectID } = require('mongodb');

const jwt = require('jsonwebtoken');

const { Blog } = require('../../models/blog');
const { User } = require('../../models/user');

const userOneId = new ObjectID();
const userSecondId = new ObjectID();
const users = [{
    _id: userOneId,
    email: 'sid@sids.com',
    password: 'passes123',
    tokens: [{
        access: 'auth',
        token: jwt.sign({ _id: userOneId, access: 'auth' }, process.env.JWT_SECRET).toString()
    }]
}, {
    _id: userSecondId,
    email: 'sid1@sids.com',
    password: '123passes',
    tokens: [{
        access: 'auth',
        token: jwt.sign({ _id: userSecondId, access: 'auth' }, process.env.JWT_SECRET).toString()
    }]
}];

const blogs = [{
    _id: new ObjectID(),
    content: "First blog",
    _creator: userOneId
}, {
    _id: new ObjectID(),
    content: "Second blog",
    _creator: userSecondId
}];

const populateBlogs = (done) => {
    Blog.remove({}).then(() => {
        return Blog.insertMany(blogs);
    }).then(() => done());
};

const populateUsers = (done) => {
    User.remove({}).then(() => {
        var userOne = new User(users[0]).save();
        var userTwo = new User(users[1]).save();
        return Promise.all([userOne, userTwo]);
    }).then(() => done());
}
module.exports = { blogs, populateBlogs, users, populateUsers };