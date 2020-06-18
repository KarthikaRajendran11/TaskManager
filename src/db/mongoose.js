const mongoose = require('mongoose');
const config = require('../util/config');

const connection_url = `mongodb://${config.get('db:host')}:${config.get('db:port')}/${config.get('db:database')}`

mongoose.connect(connection_url, {
    useNewUrlParser : true,
    useCreateIndex : true
});
