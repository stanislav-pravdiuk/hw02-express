const express = require('express');
const ctrl = require('../../controllers/auth');
const router = express.Router();
const { ValidateBody, authenticate, upload } = require('../../middleware')
const { schemas } = require('../../models/user')

router.post("/register", ValidateBody(schemas.registerSchema), ctrl.register);
router.get('/verify/:veryficationCode', ctrl.verifyEmail);
router.post('/verify', ValidateBody(schemas.emailSchema), ctrl.resendVerifyEmail);
router.post("/login", ValidateBody(schemas.loginSchema), ctrl.login);
router.get('/current', authenticate, ctrl.getCurrent);
router.post('/logout', authenticate, ctrl.logout);
router.patch('/avatars', authenticate, upload.single("avatar"), ctrl.updateAvatar )

module.exports = router;