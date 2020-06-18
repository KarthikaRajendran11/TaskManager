const request = require('supertest');
const proxyquire = require('proxyquire');
const sinon = require('sinon');
const randomstring = require('randomstring');
const assert = require('assert');
const error = require('../src/util/error');

describe('Create new user', () => {

    const ProxyRouter = proxyquire('../src/routes/user.js', {
        '../middleware/auth' : () => {
            return;
        },
        User : () => {
            return {
                "user": {
                    "age": 0,
                    "_id": "5eebd5669972ca7cf24ec1ab",
                    "name": "hij",
                    "email": "lmno@gmail.com",
                    "createdAt": "2020-06-18T20:58:14.021Z",
                    "updatedAt": "2020-06-18T20:58:14.052Z",
                    "__v": 1
                },
                "token": "some token"
            }
        },
    });

    const app = proxyquire('/Users/karthikarajendran/Documents/repo/TaskManager/src/index.js', {
        './routes/user' : ProxyRouter
    });

    it('Register new user', async () => {
        const email = randomstring.generate(7);
        const res = await request(app)
                            .post('/users')
                            .send({"name" : "ABC", "email" : `${email}@gmail.com`, "password": "secret9@"})
                            .set('Accept', 'application/json')
                            .expect('Content-Type', /json/)
                            .expect(201)
                            .then((res) => {
                                res = JSON.parse(res.text);
                                assert(res.user.email, `${email}@gmail.com`);
                            }).catch((err) => {
                                console.log(err);
                            });
    });

    it('Create user without valid payload', async () => {
        const email = randomstring.generate(7);
        const res = await request(app)
                            .post('/users')
                            .send({"name" : "ABC", "password": "secret9@"})
                            .set('Accept', 'application/json')
                            .expect('Content-Type', /json/)
                            .expect(400)
    });

});

describe('Login', () => {

    const ProxyRouter = proxyquire('../src/routes/user.js', {
        '../middleware/auth' : () => {
            return;
        },
        '../models/user.js' : {
            findByCredentials : (email, password) => {
                return {
                    "user": {
                        "age": 0,
                        "_id": "5eebd5669972ca7cf24ec1ab",
                        "name": "hij",
                        "email": "lmno@gmail.com",
                        "createdAt": "2020-06-18T20:58:14.021Z",
                        "updatedAt": "2020-06-18T20:58:14.052Z",
                        "__v": 1
                    },
                    "token": "some token",
                    generateAuthToken : () => {
                        return 'Some token';
                    }
                }
            },
            generateAuthToken : () => {
                return 'Some token';
            }
        }
    });

    const app = proxyquire('/Users/karthikarajendran/Documents/repo/TaskManager/src/index.js', {
        './routes/user' : ProxyRouter
    });

    it('Login', async () => {
        const email = randomstring.generate(7);
        const res = await request(app)
                            .post('/users/login')
                            .send({"email" : `${email}@gmail.com`, "password" : "secret9@"})
                            .set('Accept', 'application/json')
                            .expect('Content-Type', /json/)
                            .expect(200)
                            .then((res) => {
                                console.log(`${JSON.stringify(res)}`);
                            })
    });

});

describe('Invalid login', () => {

    const ProxyRouter = proxyquire('../src/routes/user.js', {
        '../middleware/auth' : () => {
            return;
        },
        '../models/user.js' : {
            findByCredentials : (email, password) => {
                return {
                    "user": {
                        "age": 0,
                        "_id": "5eebd5669972ca7cf24ec1ab",
                        "name": "hij",
                        "email": "lmno@gmail.com",
                        "createdAt": "2020-06-18T20:58:14.021Z",
                        "updatedAt": "2020-06-18T20:58:14.052Z",
                        "__v": 1
                    },
                    "token": "some token",
                    generateAuthToken : () => {
                        throw new error.auth();
                    }
                }
            },
            generateAuthToken : () => {
                return 'Some token';
            }
        }
    });

    const app = proxyquire('/Users/karthikarajendran/Documents/repo/TaskManager/src/index.js', {
        './routes/user' : ProxyRouter
    });

    it('Invalid login', async () => {
        const email = randomstring.generate(7);
        const res = await request(app)
                            .post('/users/login')
                            .send({"email" : `${email}@gmail.com`, "password" : "secret9@"})
                            .set('Accept', 'application/json')
                            .expect('Content-Type', /json/)
                            .expect(401)
                            .then((res) => {
                                console.log(`${JSON.stringify(res)}`);
                            })
    });

});
