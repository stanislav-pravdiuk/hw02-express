const express = require('express');
const ctrl = require('../../controllers/contacts');
const router = express.Router();
const { ValidateBody, isValidId } = require('../../middleware')
const { schemas } = require('../../models/contact')

router.get('/', ctrl.getAll);

router.get('/:id', isValidId, ctrl.getById);

router.post('/', ValidateBody(schemas.addSchema), ctrl.add);

router.put('/:id', isValidId, ValidateBody(schemas.addSchema), ctrl.update);

router.patch('/:id/favorite', isValidId, ValidateBody(schemas.updateFavoriteSchema), ctrl.updateFavorite);

router.delete('/:id', isValidId, ctrl.del);

module.exports = router