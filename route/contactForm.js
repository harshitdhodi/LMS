// routes/messageRoutes.js

const express = require('express');
const router = express.Router();
const {createMessage} = require('../controllers/allContactForm');

router.post("/message" , createMessage)


module.exports = router;
