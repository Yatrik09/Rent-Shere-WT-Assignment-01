import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  createOrGetConversation,
  getMyConversations,
  getMessagesByConversation,
  sendMessage,
  deleteConversation,
} from "../controllers/chatController.js";

const router = express.Router();

router.post("/conversation", protect, createOrGetConversation);
router.get("/conversations", protect, getMyConversations);
router.get("/messages/:conversationId", protect, getMessagesByConversation);
router.post("/message", protect, sendMessage);
router.delete("/conversation/:conversationId", protect, deleteConversation);

export default router;