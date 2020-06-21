const express = require('express');
const User = require('../models/user.js');
const multer = require('multer');
const email = require('../emails/account');
const logger = require('../util/logger').getLogger('UserRoute');
const err = require('../util/error');
const router = new express.Router();
const auth = require('../middleware/auth');
const frisk = require('express-frisk');

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

router.post('/users', frisk.validateRequest({
    name: {
        required: true,
        type: frisk.types.string,
        in: 'body'
    },
    email: {
        required: true,
        type: frisk.types.string,
        in: 'body'
    },
    password: {
        required: true,
        type: frisk.types.string,
        in: 'body'
    },
  }), 
  async (req, res) => {
    const user = new User(req.body);

    try {
        await user.save();
        const token = await user.generateAuthToken();
        email.sendWelcomeEmail(user.email);
        res.status(201).send({user, token});
    } catch(e){
        logger.error(e);
        res.status(400).send(new err.user.invalidPassword());
    }

  });

router.post('/users/login', frisk.validateRequest({    
    email: {
        required: true,
        type: frisk.types.string,
        in: 'body'
    },
    password: {
        required: true,
        type: frisk.types.string,
        in: 'body'
    }
  }),
  async (req, res) => {
      try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({user, token});
      } catch(e) {
        logger.error(e);
        res.status(400).send(err.user.incorrentPassword());
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
        res.status(500).send(new err.Err())
    }
});

router.post('/users/logoutAll', auth, async(req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch(e) {
        logger.error(e);
        res.status(500).send(new err.Err())
    }
});

router.patch('/users/me', auth, frisk.validateRequest({
      name: {
          required: false,
          type: frisk.types.string,
          in: 'body'
      },
      email: {
          required: false,
          type: frisk.types.string,
          in: 'body'
      },
      password: {
          required: false,
          type: frisk.types.string,
          in: 'body'
      },
      age: {
        required: false,
        type: frisk.types.integer,
        in: 'body'
    }
  }), 
  async (req, res) => { 
    try {
        Object.keys(req.body).forEach((update) => {
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

router.get('/users/:id/avatar', auth, 
  async (req, res) => {
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
