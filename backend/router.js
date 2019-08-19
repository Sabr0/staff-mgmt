'use strict';
const express = require('express');
const router = express.Router();

const controller = require('./controller');


router.get('/employees', controller.getAll);
router.get('/employees/:id', controller.getCurEmployee);
router.post('/employees', controller.createEmployee);
router.put('/employees/:id', controller.editEmployee);
router.delete('/employees/:id', controller.deleteEmployee);

/* Helper function api call */
router.get('/dr/:id', controller.getCurDirectReport);

module.exports = router;