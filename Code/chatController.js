import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";

export const createOrGetConversation = async (req, res) => {
  try {
    const { itemId, ownerId } = req.body;
    const renterId = req.user.id;

    if (!itemId || !ownerId) {
      return res.status(400).json({ message: "itemId and ownerId are required" });
    }

    let conversation = await Conversation.findOne({
      itemId,
      ownerId,
      renterId,
    })
      .populate("ownerId", "name email")
      .populate("renterId", "name email")
      .populate("itemId", "title images");

    if (!conversation) {
      conversation = await Conversation.create({
        itemId,
        ownerId,
        renterId,
      });

      conversation = await Conversation.findById(conversation._id)
        .populate("ownerId", "name email")
        .populate("renterId", "name email")
        .populate("itemId", "title images");
    }

    res.status(200).json(conversation);
  } catch (error) {
    res.status(500).json({
      message: "Server error while creating or fetching conversation",
      error: error.message,
    });
  }
};

export const getMyConversations = async (req, res) => {
  try {
    const userId = req.user.id;

    const conversations = await Conversation.find({
      $or: [{ ownerId: userId }, { renterId: userId }],
    })
      .populate("ownerId", "name email")
      .populate("renterId", "name email")
      .populate("itemId", "title images")
      .sort({ updatedAt: -1 });

    res.status(200).json(conversations);
  } catch (error) {
    res.status(500).json({
      message: "Server error while fetching conversations",
      error: error.message,
    });
  }
};

export const getMessagesByConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const messages = await Message.find({ conversationId }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({
      message: "Server error while fetching messages",
      error: error.message,
    });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { conversationId, text } = req.body;
    const senderId = req.user.id;

    if (!conversationId || !text) {
      return res.status(400).json({ message: "conversationId and text are required" });
    }

    const newMessage = await Message.create({
      conversationId,
      senderId,
      text,
    });

    await Conversation.findByIdAndUpdate(conversationId, {
      updatedAt: new Date(),
    });

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({
      message: "Server error while sending message",
      error: error.message,
    });
  }
};

export const deleteConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    const isOwner = conversation.ownerId.toString() === userId;
    const isRenter = conversation.renterId.toString() === userId;

    if (!isOwner && !isRenter) {
      return res.status(403).json({ message: "Not authorized to delete this conversation" });
    }

    await Message.deleteMany({ conversationId });
    await Conversation.findByIdAndDelete(conversationId);

    res.status(200).json({ message: "Conversation deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Server error while deleting conversation",
      error: error.message,
    });
  }
};