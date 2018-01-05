var env = process.env.NODE_ENV || 'development';

console.log("ENV IS********", env);
if (env == 'development') {
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
} else if (env == "test") {
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
}
else if (env == "production") {
    process.env.MONGODB_URI = 'mongodb://sidd1004:tododb@ds239097.mlab.com:39097/todoapp';
}