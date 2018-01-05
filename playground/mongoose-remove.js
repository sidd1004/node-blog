const { ObjectID } = require('mongodb');

const { mongoose } = require('./../server/db/mongoose');
const { Todo } = require('./../server/models/todo');
const { User } = require('./../server/models/user');

Todo.findByIdAndRemove('5a4cb5e4d7f6c13c18dee7bd').then((todo) => {

});