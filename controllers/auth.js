const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const gravatar = require("gravatar");
const path = require('path');
const jimp = require('jimp');
const { SECRET_KEY, BASE_URL } = process.env;
const { User } = require("../models/user");
const {
        HttpError,
        CtrlWrapper,
        sendEmail
} = require('../helpers');
// const { promises } = require('dns');
const avatarsDir = path.join(__dirname, '../', 'public', 'avatars');
const fs = require('fs/promises');
const { nanoid } = require('nanoid');

const register = async (req, res) => { 
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
        throw HttpError(409, 'Email in use')
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email);
    const veryficationCode = nanoid();
    const newUser = await User.create({ ...req.body, password: hashPassword, avatarURL, veryficationCode });
    const verifyEmail = {
        to: email,
        subject: 'verify email',
        html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${veryficationCode}" >Verify email</a>`
    };

    await sendEmail(verifyEmail);

    res.status(201).json({
        email: newUser.email,
        subscription: newUser.subscription,
    });
};

const verifyEmail = async (req, res) => {
    const { veryficationCode } = req.params;
    const user = await User.findOne({ veryficationCode });
    if (!user) {
        throw HttpError(401, 'User not found')
    };
    await User.findByIdAndUpdate(user._id, { verify: true, veryficationCode: '' });
    res.json({
        message: 'Verification successful'
    });
};

const resendVerifyEmail = async (req, res) => { 
    const { email } = req.body;
    const user = User.findOne({ email });
    if (!user) { 
        throw HttpError(401, 'User not found')
    };
    if (user.verify) {
        throw HttpError(401, 'Verification has already been passed')
    };
    const verifyEmail = {
        to: email,
        subject: 'verify email',
        html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${user.veryficationCode}" >Verify email</a>`
    };
    await sendEmail(verifyEmail);
    res.json({
        message: 'Verification email sent'
    });
};

const login = async (req, res) => { 
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) { 
        throw HttpError(401, 'Email or password is wrong')
    };
    if (!user.verify) { 
        throw HttpError(401, 'User not found')
    };
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
        throw HttpError(401, 'Email or password is wrong'); 
    };
    const payload = {
        id: user._id
    };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '23h' });
    await User.findByIdAndUpdate(user._id, { token });
    res.json({
        token,
        email,
        user: user.subscription
    });
};

const logout = async (req, res) => { 
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: '' });
    res.status(204)
    .json({
        message: 'No Content'
    });
};

const getCurrent = async (req, res) => { 
    const { email, subscription } = req.user;
    res.json({
        email,
        subscription
    });
};

const updateAvatar = async (req, res) => {
    const{_id} = req.user;
    const { path: tempUpload, originalname } = req.file;
    const filename = `${_id}_${originalname}`;
    const resultUpload = path.join(avatarsDir, filename);
    await fs.rename(tempUpload, resultUpload);
    const image = await jimp.read(resultUpload);
    await image.resize(250, 250);
    const resizedFilename = `resized_${filename}`;
    const resizedPath = path.join(avatarsDir, resizedFilename);
    await image.writeAsync(resizedPath);
    const avatarURL = path.join('avatars', resizedFilename);
    await User.findByIdAndUpdate(_id, { avatarURL });
    res.json({
        avatarURL
    });
};

module.exports = {
    register: CtrlWrapper(register),
    verifyEmail: CtrlWrapper(verifyEmail),
    resendVerifyEmail:CtrlWrapper(resendVerifyEmail),
    login: CtrlWrapper(login),
    getCurrent: CtrlWrapper(getCurrent),
    logout: CtrlWrapper(logout),
    updateAvatar: CtrlWrapper(updateAvatar)
};