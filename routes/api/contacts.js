const express = require('express');
const ctrl = require('../../controllers/contacts');
const router = express.Router();
const { ValidateBody, isValidId, authenticate } = require('../../middleware')
const { schemas } = require('../../models/contact')

router.get('/', authenticate, ctrl.getAll);

router.get('/:id', authenticate, isValidId, ctrl.getById);

router.post('/', authenticate, ValidateBody(schemas.addSchema), ctrl.add);

router.put('/:id', authenticate, isValidId, ValidateBody(schemas.addSchema), ctrl.update);

router.patch('/:id/favorite', authenticate, isValidId, ValidateBody(schemas.updateFavoriteSchema), ctrl.updateFavorite);

router.delete('/:id', authenticate, isValidId, ctrl.del);

module.exports = router