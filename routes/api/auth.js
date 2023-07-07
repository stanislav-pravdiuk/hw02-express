const express = require('express');
const ctrl = require('../../controllers/auth');
const router = express.Router();
const { ValidateBody } = require('../../middleware')
const { schemas } = require('../../models/user')

router.post("/register", ValidateBody(schemas.registerSchema), ctrl.register);
router.post("/login", ValidateBody(schemas.loginSchema), ctrl.login);

module.exports = router;