const _ = require('lodash');
const express = require('express');
const Note = require('../repository/notes.repository');
const auth = require('../middleware/auth');
const error = require('../util/error');
const frisk = require('express-frisk');

const router = express.Router();

router.get('/notes', auth, frisk.validateRequest({
        notes: {
            required: false,
            type: frisk.types.integer,
            in: 'query'
        }
    }), 
    async (req, res) => {
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

router.post('/notes', auth, frisk.validateRequest({
        notes: {
            required: true,
            type: frisk.types.string,
            in: 'body'
        }
    }),
    async (req, res) => {
        const response = await Note.insertNotesIntoDocuments(req.body.notes, req.user.id);
        res.status(200).send(response);
});

router.patch('/notes', auth, frisk.validateRequest({
    id: {
        required: true,
        type: frisk.types.integer,
        in: 'body'
    },
    notes: {
        required: true,
        type: frisk.types.string,
        in: 'body'
    }
}), async (req, res) => {
    const id = (await Note.findNoteById(req.body.id)).id;
    const response = await Note.updateNote(id, req.body.notes);
    res.send(response).send(200);
});

module.exports = router;