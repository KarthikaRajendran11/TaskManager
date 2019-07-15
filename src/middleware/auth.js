const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req, res ,next) => {

    try {
        const token = req.header('Authorization').replace("Bearer ", "")
        const id = jwt.decode(token, 'thisismynodecourse')
        const user = await User.findOne({_id : id._id, 'tokens.token' : token})
        if(!user){
            throw new Error().message("Unauthorized");
        }
        req.token = token
        req.user = user
        next()
    } catch(e){
        res.status(401).send({error : 'Please authenticate'})
    }
};

module.exports = auth
