// routes/messageRoutes.js

const express = require('express');
const router = express.Router();
const messageController = require('../controllers/contact_lead');

router.post('/messages', messageController.createMessage);
router.get('/messages', messageController.getMessages);
router.get('/messages/:id', messageController.getMessageById);
router.put('/messages/:id', messageController.updateMessage);
router.delete('/messages/:id', messageController.deleteMessage);

module.exports = router;
