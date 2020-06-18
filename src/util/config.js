'use strict';

const path = require('path');

const root = path.resolve(path.join(__dirname, '..'));

const config = require('nconf')
    .argv()
    .env({ lowerCase : true, separator: '__'})
    .file('environemnt', {
        file: path.join(root, 'config', `${process.env.NODE_ENV}.json`)
    })
    .file('defaults', {
        file: path.join(root, 'config', 'default.json')
    });

module.exports = config;