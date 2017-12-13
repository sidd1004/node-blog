const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log("Unable to connect to MongoDB");
    }
    console.log("Connected to MongoDB");
    /* db.collection('Todos').insertOne({
        text: 'Something to do',
        completed: false
    }, (err, result) => {
        if (err) {
            return console.log("Unable to insert todo", err);
        }

        console.log(JSON.stringify(result.ops, "", 2));
    }); */
    db.collection('Users').insertOne({
        name: 'Sidd',
        age: 23,
        location: 'Bangalore'
    }, (err, result) => {
        if (err) {
            return console.log("Unable to insert user", err);
        }

        console.log(result.ops[0]._id.getTimestamp());
    });
    db.close();
});