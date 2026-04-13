import streamifier from "streamifier";
import Listing from "../models/Listing.js";
import cloudinary from "../config/cloudinary.js";

const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "rentandshare" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

export const createListing = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized. Please login."
      });
    }

    const {
      title,
      description,
      category,
      location,
      pricePerHour,
      pricePerDay,
      minimumRentalDuration,
      securityDeposit,
      condition
    } = req.body;

    if (
      !title ||
      !description ||
      !category ||
      !location ||
      !pricePerHour ||
      !pricePerDay ||
      !minimumRentalDuration ||
      !securityDeposit ||
      !condition
    ) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        message: "At least one image is required"
      });
    }

    const uploadedImages = [];

    for (const file of req.files) {
      const result = await uploadToCloudinary(file.buffer);
      uploadedImages.push(result.secure_url);
    }

    const listing = await Listing.create({
      user: req.user.id,
      title,
      description,
      category,
      location,
      pricePerHour: Number(pricePerHour),
      pricePerDay: Number(pricePerDay),
      minimumRentalDuration: Number(minimumRentalDuration),
      securityDeposit: Number(securityDeposit),
      condition,
      images: uploadedImages
    });

    return res.status(201).json({
      message: "Listing created successfully",
      listing
    });
  } catch (error) {
    console.error("CREATE LISTING ERROR:", error);
    return res.status(500).json({
      message: "Server error while creating listing",
      error: error.message
    });
  }
};

export const getListings = async (req, res) => {
  try {
    const listings = await Listing.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(listings);
  } catch (error) {
    res.status(500).json({
      message: "Server error while fetching listings",
      error: error.message
    });
  }
};

export const getListingById = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate(
      "user",
      "name email"
    );

    if (!listing) {
      return res.status(404).json({
        message: "Listing not found"
      });
    }

    res.status(200).json(listing);
  } catch (error) {
    res.status(500).json({
      message: "Server error while fetching listing",
      error: error.message
    });
  }
};

export const getMyListings = async (req, res) => {
  try {
    const listings = await Listing.find({ user: req.user.id }).sort({
      createdAt: -1
    });

    res.status(200).json(listings);
  } catch (error) {
    res.status(500).json({
      message: "Server error while fetching your listings",
      error: error.message
    });
  }
};

export const updateListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({
        message: "Listing not found"
      });
    }

    if (listing.user.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Not authorized to edit this listing"
      });
    }

    const {
      title,
      description,
      category,
      location,
      pricePerHour,
      pricePerDay,
      minimumRentalDuration,
      securityDeposit,
      condition
    } = req.body;

    if (
      !title ||
      !description ||
      !category ||
      !location ||
      !pricePerHour ||
      !pricePerDay ||
      !minimumRentalDuration ||
      !securityDeposit ||
      !condition
    ) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    let updatedImages = listing.images || [];

    if (req.files && req.files.length > 0) {
      updatedImages = [];

      for (const file of req.files) {
        const result = await uploadToCloudinary(file.buffer);
        updatedImages.push(result.secure_url);
      }
    }

    listing.title = title;
    listing.description = description;
    listing.category = category;
    listing.location = location;
    listing.pricePerHour = Number(pricePerHour);
    listing.pricePerDay = Number(pricePerDay);
    listing.minimumRentalDuration = Number(minimumRentalDuration);
    listing.securityDeposit = Number(securityDeposit);
    listing.condition = condition;
    listing.images = updatedImages;

    await listing.save();

    res.status(200).json({
      message: "Listing updated successfully",
      listing
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error while updating listing",
      error: error.message
    });
  }
};

export const deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({
        message: "Listing not found"
      });
    }

    if (listing.user.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Not authorized to delete this listing"
      });
    }

    await listing.deleteOne();

    res.status(200).json({
      message: "Listing deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error while deleting listing",
      error: error.message
    });
  }
};