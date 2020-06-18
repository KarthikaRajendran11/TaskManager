const jwt = require('jsonwebtoken');
const User = require('../models/user');
const logger = require('../util/logger').getLogger('auth');
const err = require('../util/error');

const auth = async (req, res ,next) => {

    try {
        const token = req.header('Authorization').replace("Bearer ", "")
        const id = jwt.decode(token, process.env.JWT_SECRET)
        const user = await User.findOne({_id : id._id, 'tokens.token' : token})
        if(!user){
            throw new Error().message("Unauthorized");
        }
        req.token = token
        req.user = user
        next()
    } catch(e){
        logger.error(e);
        res.status(401).send(new err.auth())
    }
};

module.exports = auth
