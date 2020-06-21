const _ = require('lodash');
const Note = require('../models/notes');
const error = require('../util/error');

const Notes = {
    findNotesByOwner : async (ownerId) => {
        const documents = await Note.find({ owner : ownerId }).exec();
        return documents;
    },

    findNoteById : async (noteId) => {
        const docs = await Note.findOne({_id: noteId}).exec();
        return docs;
    },

    insertNotesIntoDocuments : async (_notes, ownerId) => {
        const docs = await Note.insertMany([{notes : _notes, owner: ownerId}]);
        return docs;
    },

    updateNote : async (noteId, note) => {
        const docs = await Note.updateOne({_id: noteId}, {notes: note}).exec();
        return docs;
    }

}

module.exports = Notes;