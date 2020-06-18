'use strict';

const express = require('express');
const multer = require('multer');
require('./db/mongoose');
const config = require('./util/config');
const logger = require('./util/logger').getLogger('core');

const userRouter = require('./routes/user');
const taskRouter = require('./routes/task');

const app = express();
const port = config.get('port');

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

const upload = multer({
  dest: 'images'
});

app.listen(port, () => {
  logger.info('Server is up on port ' + port);
});


app.post('/upload', upload.single('upload'), (req, res) => {
  res.send();
});

module.exports = app;
