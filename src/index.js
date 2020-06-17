const express = require('express');
const multer = require('multer');
require('./db/mongoose');
const userRouter = require('./routes/user');
const taskRouter = require('./routes/task');

const app = express();
const port = 8080;

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

const upload = multer({
  dest: 'images'
});

app.listen(port, () => {
  console.log('Server is up on port ' + port);
});


app.post('/upload', upload.single('upload'), (req, res) => {
  res.send();
});
