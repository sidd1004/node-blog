const { ObjectID } = require('mongodb');
const { mongoose } = require('./../server/db/mongoose');
const { Todo } = require('./../server/models/todo');

var id = "5a37cfc1f02d8b2a102439771";

if (!ObjectID.isValid(id)) {
    console.log("ID not valid");
}

/* Todo.find({
    _id: id
}).then((todos) => {
    console.log("Todos", todos);
});

Todo.findOne({
    _id: id
}).then((todo) => {
    console.log("Todo", todo);
}); */

Todo.findById(id).then((todoById) => {
    if (!todoById) {
        return console.log("Wrong ID");
    }
    console.log("One todo", todoById)
}).catch((e) => console.log(e));