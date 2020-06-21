const _ = require('lodash');
const express = require('express');
const Note = require('../repository/notes.repository');
const auth = require('../middleware/auth');
const error = require('../util/error');

const router = express.Router();

router.get('/notes', auth, async (req, res) => {
    const size = req.query.size;
    try {
        await req.user.populate({
            path: 'notes',
            options: {
                limit: size
            }
        }).execPopulate();
        res.send(req.user.notes);
    } catch(err) {
        res.send(err).status(400);
    }
    const notes = await Note.findNotesByOwner(req.user.id);
    res.status(200).send(notes);
});

router.post('/notes', auth, async (req, res) => {
    // validate request body -> frisk
    // rate limit ?
    const response = await Note.insertNotesIntoDocuments(req.body.notes, req.user.id);
    res.status(200).send(response);
});

router.patch('/notes', auth, async (req, res) => {
    // validate if the correct feilds are being updated
    const keys = _.keys(req.body);
    keys.every((key) => {['notes', 'id'].includes(key)});

    // find note id
    const id = (await Note.findNoteById(req.body.id)).id;
    const response = await Note.updateNote(id, req.body.notes);
    res.send(response).send(200);
});

module.exports = router;