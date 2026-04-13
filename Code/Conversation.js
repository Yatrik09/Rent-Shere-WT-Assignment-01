import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      required: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    renterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

conversationSchema.index(
  { itemId: 1, ownerId: 1, renterId: 1 },
  { unique: true }
);

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;