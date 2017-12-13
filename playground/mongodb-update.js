const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log("Unable to connect to MongoDB");
    }
    console.log("Connected to MongoDB");

    /* db.collection('Todos').findOneAndUpdate({
        _id: new ObjectID('5a3107acd598d61328bdb9b1')
    }, {
            $set: {
                completed: true
            }
        }, {
            returnOriginal: false
        }).then((result) => {
            console.log(result);
        }); */
    db.collection('Users').findOneAndUpdate({
        _id: new ObjectID('5a3108bf7d594e0cc8dd707c')
    }, {
            $set: {
                name: "dude"
            },
            $inc: {
                age: 1
            }
        }, {
            returnOriginal: false
        }).then((result) => {
            console.log(result);
        });

    // db.close();
});