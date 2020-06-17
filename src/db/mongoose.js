const mongoose = require('mongoose');
// const connection_url = process.env.MONGODB_URL
const connection_url = "mongodb://localhost:27017/task-manager"

mongoose.connect(connection_url, {
    useNewUrlParser : true,
    useCreateIndex : true
});
