const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log("Unable to connect to MongoDB");
    }
    console.log("Connected to MongoDB");

    /* db.collection('Todos').deleteMany({ text: 'Eat food' }).then((result) => {
        console.log(result);
    }); */

    /* db.collection('Todos').deleteOne({ text: 'Eat food' }).then((result) => {
        console.log(result);
    }); */

    /* db.collection('Todos').findOneAndDelete({ text: 'Eat food' }).then((result) => {
        console.log(result);
    }); */

    db.collection('Users').deleteMany({ name: 'Sidd' });

    db.collection('Users').findOneAndDelete({ _id: new ObjectID('5a3007a1e861c20914abb7e9') }).then((result) => {
        console.log(result);
    })
    // db.close();
});