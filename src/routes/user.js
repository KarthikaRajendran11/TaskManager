const express = require('express');
const User = require('../models/user.js');
const multer = require('multer');
const email = require('../emails/account');
const logger = require('../util/logger').getLogger('UserRoute');

const router = new express.Router();
const auth = require('../middleware/auth');

const upload = multer({
  limits : {
    fileSize : 1000000
  },
  fileFilter(req, file, cb){
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return new cb(new Error('Please upload an image'));
    }
    cb(undefined, true);
  }
});

router.post('/users', async (req, res) => {
    const user = new User(req.body);

    try {
        await user.save();
        const token = await user.generateAuthToken();
        email.sendWelcomeEmail(user.email);
        res.status(201).send({user, token});
    } catch(e){
        logger.error(e);
        res.status(400).send(e);
    }

  });

router.post('/users/login', async (req, res) => {
      try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({user, token});
      } catch(e) {
        logger.error(e);
        res.status(400).send();
      }
});

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.status(200).send()
    } catch(e) {
        logger.error(e);
        res.status(500).send()
    }
});

router.post('/users/logoutAll', auth, async(req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch(e) {
        logger.error(e);
        res.status(500).send()
    }
});

router.patch('/users/me', auth, async (req, res) => { 
  const updates = Object.keys(req.body)
  const allowedUpdates = ['name', 'email', 'password', 'age']
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

  if (!isValidOperation) {
      return res.status(400).send({ error: 'Invalid updates!' })
  }

  try {

      updates.forEach((update) => {
        req.user[update] = req.body[update];
      });
      await req.user.save();
      res.send(req.user)
  } catch (e) {
      logger.error(e);
      res.status(400).send(e)
  }
});

router.get('/users/me', auth, async (req, res) => {

  res.send(req.user);

});

router.delete('/users/me', auth, async (req, res) => {

    try{
      email.sendGoawayEmail(req.user.email)
      await req.user.remove()
      res.send(req.user);
    } catch(e){
      logger.error(e);
      res.status(500).send(e);
    }

});

router.delete('/users/me/avatar', auth, async (req, res) => {
  req.user.avatar = undefined
  await req.user.save();
  res.send();
});

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
  req.user.avatar = req.file.buffer
  await req.user.save();
  res.send();
}, (error, req, res, next) => {
  res.status(400).send({error : error.message});
});

router.get('/users/:id/avatar', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)  
    if(!user){
     throw new Error();
    }
    res.set('Content-Type', 'image/jpg')
    res.send(user.avatar)
  } catch(e) {
    logger.error(e);
    res.status(400).send()
  }
});

module.exports = router;
