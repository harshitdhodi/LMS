const Message = require("../models/contact_lead")
exports.createMessage = async (req, res) => {
    try {
      const message = new Message(req.body);
      await message.save();
      res.status(201).json({
        success: true,
        data: message
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };


  // Get all messages
exports.getMessages = async (req, res) => {
    try {
      const messages = await Message.find();
      res.status(200).json({
        success: true,
        data: messages
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };
  
  // Get a single message by ID
  exports.getMessageById = async (req, res) => {
    try {
      const message = await Message.findById(req.params.id);
      if (!message) {
        return res.status(404).json({
          success: false,
          message: 'Message not found'
        });
      }
      res.status(200).json({
        success: true,
        data: message
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };
  
  // Update a message by ID
  exports.updateMessage = async (req, res) => {
    try {
      const message = await Message.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!message) {
        return res.status(404).json({
          success: false,
          message: 'Message not found'
        });
      }
      res.status(200).json({
        success: true,
        data: message
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };
  
  // Delete a message by ID
  exports.deleteMessage = async (req, res) => {
    try {
      const message = await Message.findByIdAndDelete(req.params.id);
      if (!message) {
        return res.status(404).json({
          success: false,
          message: 'Message not found'
        });
      }
      res.status(200).json({
        success: true,
        message: 'Message deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };