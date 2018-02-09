var { mongoose } = require('../db/mongoose');

var Blog = mongoose.model('Blog', {
    content: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    _creator: {
        require: true,
        type: mongoose.Schema.Types.ObjectId
    }
});

module.exports = { Blog }