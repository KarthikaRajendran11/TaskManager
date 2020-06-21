const mongoose = require('mongoose');
const uuid = require('uuid4');
const error = require('../util/error');

const notesSchema = new mongoose.Schema({
    owner : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref: 'User'
    },
    notes : {
        type : mongoose.Schema.Types.String,
        required: true
    }
}, {
    timestamps: true
});

const Notes = mongoose.model('Notes', notesSchema);

module.exports = Notes;