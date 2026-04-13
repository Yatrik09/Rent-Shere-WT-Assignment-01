import express from "express";
import protect from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import {
  createListing,
  getListings,
  getListingById,
  getMyListings,
  updateListing,
  deleteListing,
} from "../controllers/listingController.js";

const router = express.Router();

router.post("/", protect, upload.array("images", 5), createListing);
router.get("/", getListings);
router.get("/my-listings", protect, getMyListings);
router.get("/:id", getListingById);
router.put("/:id", protect, upload.array("images", 5), updateListing);
router.delete("/:id", protect, deleteListing);

export default router;