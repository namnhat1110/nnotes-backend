const express = require('express');
const router = express.Router();

const authApi = require('./auth.api');
router.use('/auth', authApi);

const notesApi = require('./notes.api');
router.use('/notes', notesApi);

const userApi = require('./user.api');
router.use('/user', userApi);

module.exports = router;
