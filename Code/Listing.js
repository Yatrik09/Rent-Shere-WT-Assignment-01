import mongoose from "mongoose";

const listingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    title: {
      type: String,
      required: true
    },

    description: {
      type: String,
      required: true
    },

    category: {
      type: String,
      required: true
    },

    location: {
      type: String,
      required: true
    },

    pricePerHour: {
      type: Number,
      required: true
    },

    pricePerDay: {
      type: Number,
      required: true
    },

    minimumRentalDuration: {
      type: Number,
      required: true
    },

    securityDeposit: {
      type: Number,
      required: true
    },

    condition: {
      type: String,
      enum: ["New", "Used"],
      required: true
    },

    images: [String]

  },
  { timestamps: true }
);

const Listing = mongoose.model("Listing", listingSchema);

export default Listing;