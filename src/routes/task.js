const express = require('express');
const Task = require('../models/task.js');
const auth = require('../middleware/auth');
const logger = require('../util/logger').getLogger('TaskRoute');
const router = express.Router();

router.post('/tasks', auth, async (req, res) => {
    
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })

    try {
        await task.save();
        res.status(201).send(task);
    } catch(e) {
        logger.error(e);
        res.status(400).send(e);
    }

});

router.get('/tasks', auth, async (req, res) => {
    const match = {}
    const sort = {}

    if (req.query.completed) {
        match.completed = req.query.completed === 'true'
    }
    if(req.query.sortBy){
        const part = req.query.sortBy.split(':')
        sort[part[0]] = part[1] === 'desc' ? -1 : 1
    }

    try {
        await req.user.populate({
            path: 'tasks',
            match,
            options : {
                limit : parseInt(req.query.limit),
                skip : parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(req.user.tasks)
    } catch (e) {
        logger.error(e);
        res.status(500).send()
    }
})

router.get('/task/:id', auth, async (req, res) => {
  const _id = req.params.id
  try {
      const task = await Task.findOne({_id, owner : req.user._id})

      if(!task){
          res.status(404).send()
      }

      res.status(200).send(task);
  } catch(e) {
      logger.error(e);
      res.status(400).send(e);
  }

});

router.patch('/tasks/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['description', 'completed'];
  const isAllowed = updates.every((update) => allowedUpdates.includes(update));

  if(!isAllowed){
    res.status(404).send({error : 'Invalid Updates !'});
  }

  try {
      const task = await Task.findOne({owner : req.user._id, _id : req.params.id});

      if(!task){
          res.status(400).send('Cannot find task');
      }

      updates.forEach((update) => {
        task[update] = req.body[update];
      });

      await task.save();
      res.send(task);

  }catch(e){
      logger.error(e);
      res.status(400).send();
  }
});

router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({_id : req.params.id, owner : req.user._id});

        if(!task){
          res.status(400).send('Could not find task');
        }

        res.send(task);

    } catch(e){
        logger.error(e);
        res.status(500).send(e);
    }
});

module.exports = router;

