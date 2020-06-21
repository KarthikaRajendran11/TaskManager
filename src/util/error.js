'use strict';

const Err = require('egads').extend('Unexpected error occured', 500, 'Internal Server error');

Err.auth = Err.extend('Unauthorised', 401, 'AuthError');

Err.user = Err.extend('User not found. Please create an account', 404, 'User not found')
Err.user.invalidPassword = Err.user.extend('Password not valid', 400, 'Password does not meet requirements');
Err.user.incorrentPassword = Err.user.extend('Incorrect username/password', 404, 'Incorrect password/username');
Err.user.invalidUpdates = Err.user.extend('Invalid parameters updated', 404, 'Invalid updates');

Err.task = Err.extend('Unexpected error', 500, 'Internal server error');
Err.task.InvalidTaskId = Err.task.extend('No task with id', 404, 'Invalida task id');

Err.notes = Err.extend('Unable to save notes', 400, 'Improper format');
Err.notes.NoNoteId = Err.notes.extend('No note id provided', 400, 'Unknown notes ID');
Err.notes.NoOwnerId = Err.notes.extend('No owner id provided', 400, 'Unknown owner ID');

module.exports = Err;
