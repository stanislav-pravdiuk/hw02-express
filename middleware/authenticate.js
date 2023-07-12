const jwt = require('jsonwebtoken');
const { User } = require('../models/user');
const { HttpError } = require('../helpers');
const { SECRET_KEY } = process.env; 

const authenticate = async (req, res, next) => {
    const { authorization = '' } = req.headers;
    const [bearer, token] = authorization.split(" ");
    console.log('bearer:', req.headers)
    if (bearer !== 'Bearer') {
        next(HttpError(401, "Not authorized"));
    };
    try {
        const { id } = jwt.verify(token, SECRET_KEY);
        const user = await User.findById(id);
        if (!user) {
            next(HttpError(401, "Not authorized"));
        };
        next();
    } catch {
        next(HttpError(401, "Not authorized"));
    }
};

module.exports = authenticate;