const mongoose = require('mongoose');

let db = {
    localhost: 'mongodb://localhost:27017/TodoApp',
    mlab: 'mongodb://sidd1004:tododb@ds239097.mlab.com:39097/todoapp'
};

mongoose.Promise = global.Promise;
mongoose.connect(process.env.PORT ? db.mlab : db.localhost);

module.exports = { mongoose };