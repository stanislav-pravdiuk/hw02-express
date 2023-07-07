const { User } = require("../models/user");
const {
        HttpError,
        CtrlWrapper
} = require('../helpers');

const register = async (req, res) => { 
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (user) {
        throw HttpError(409, 'Email allready in use')
    }
    const newUser = await User.create(req.body);
    res.status(201).json({
        email: newUser.email,
        subscription: newUser.subscription,
    });
};

module.exports = {
    register: CtrlWrapper(register)
};