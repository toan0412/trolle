const express = require('express');
const router = express.Router();
const authController = require('../controllers/user.controller.cjs');

router.post('/login', authController.login);

module.exports = router;
