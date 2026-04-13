import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./UploadListing.module.css";

const categoryOptions = [
  "Car",
  "Bike",
  "Tool",
  "Camera",
  "Mobile",
  "Tent",
  "Laptop",
  "Drone",
  "Scooter",
  "Boat",
  "Guitar",
  "Sports Gear",
  "Books",
  "Party Items",
  "Electronics",
  "Vehicles"
];

const UploadListing = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const editMode = location.state?.editMode || false;
  const listing = location.state?.listing || null;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    pricePerHour: "",
    pricePerDay: "",
    minimumRentalDuration: "",
    securityDeposit: "",
    condition: "Used"
  });

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  useEffect(() => {
    if (editMode && listing) {
      setFormData({
        title: listing.title || "",
        description: listing.description || "",
        category: listing.category || "",
        location: listing.location || "",
        pricePerHour: listing.pricePerHour || "",
        pricePerDay: listing.pricePerDay || "",
        minimumRentalDuration: listing.minimumRentalDuration || "",
        securityDeposit: listing.securityDeposit || "",
        condition: listing.condition || "Used"
      });
    }
  }, [editMode, listing]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const dropdown = document.getElementById("upload-category-dropdown");
      if (dropdown && !dropdown.contains(event.target)) {
        setShowCategoryDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Kindly login to continue");
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      if (!formData.category) {
        setMessage("Please select a category");
        setLoading(false);
        return;
      }

      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("category", formData.category);
      data.append("location", formData.location);
      data.append("pricePerHour", formData.pricePerHour);
      data.append("pricePerDay", formData.pricePerDay);
      data.append("minimumRentalDuration", formData.minimumRentalDuration);
      data.append("securityDeposit", formData.securityDeposit);
      data.append("condition", formData.condition);

      images.forEach((image) => {
        data.append("images", image);
      });

      const url = editMode
        ? `http://localhost:5000/api/listings/${listing._id}`
        : "http://localhost:5000/api/listings";

      const method = editMode ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: data
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to save listing");
      }

      setMessage(
        editMode
          ? "Listing updated successfully!"
          : "Listing uploaded successfully!"
      );

      setTimeout(() => {
        navigate("/mylisting");
      }, 1000);
    } catch (error) {
      console.error("Save error:", error);
      setMessage(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.wrapper}>
        <div className={styles.heroCard}>
          <h1>{editMode ? "Edit Your Item" : "Upload New Item"}</h1>
          <p>
            {editMode
              ? "Update your listing details and keep your item information fresh."
              : "Add your item with proper details so users can discover and book it easily."}
          </p>
        </div>

        <div className={styles.formCard}>
          <div className={styles.formHeader}>
            <h2>{editMode ? "Update Listing" : "Add Listing"}</h2>
            <span className={styles.badge}>
              {editMode ? "Edit Mode" : "New Listing"}
            </span>
          </div>

          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className={styles.grid}>
              <div className={styles.field}>
                <label>Item Title</label>
                <input
                  type="text"
                  name="title"
                  placeholder="Enter item title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.field}>
                <label>Category</label>

                <div
                  id="upload-category-dropdown"
                  className={styles.dropdownWrapper}
                >
                  <div
                    className={styles.customDropdown}
                    onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                  >
                    <span
                      className={
                        formData.category
                          ? styles.dropdownValue
                          : styles.dropdownPlaceholder
                      }
                    >
                      {formData.category || "Select Category"}
                    </span>
                    <i
                      className={`bi ${
                        showCategoryDropdown
                          ? "bi-chevron-up"
                          : "bi-chevron-down"
                      }`}
                    ></i>
                  </div>

                  {showCategoryDropdown && (
                    <div className={styles.dropdownMenu}>
                      {categoryOptions.map((cat, index) => (
                        <div
                          key={index}
                          className={`${styles.dropdownItem} ${
                            formData.category === cat ? styles.dropdownActive : ""
                          }`}
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              category: cat
                            }));
                            setShowCategoryDropdown(false);
                          }}
                        >
                          {cat}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.field}>
                <label>Location</label>
                <input
                  type="text"
                  name="location"
                  placeholder="Enter location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.field}>
                <label>Price Per Hour</label>
                <input
                  type="number"
                  name="pricePerHour"
                  placeholder="Enter hourly price"
                  value={formData.pricePerHour}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.field}>
                <label>Price Per Day</label>
                <input
                  type="number"
                  name="pricePerDay"
                  placeholder="Enter daily price"
                  value={formData.pricePerDay}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.field}>
                <label>Minimum Rental Duration</label>
                <input
                  type="number"
                  name="minimumRentalDuration"
                  placeholder="Enter minimum duration"
                  value={formData.minimumRentalDuration}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.field}>
                <label>Security Deposit</label>
                <input
                  type="number"
                  name="securityDeposit"
                  placeholder="Enter deposit amount"
                  value={formData.securityDeposit}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.field}>
                <label>Condition</label>
                <select
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  required
                >
                  <option value="Used">Used</option>
                  <option value="New">New</option>
                </select>
              </div>

              <div className={`${styles.field} ${styles.fullWidth}`}>
                <label>Upload Images</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <small>
                  {editMode
                    ? "Leave this empty if you want to keep existing images."
                    : "Upload one or more clear item images."}
                </small>
              </div>

              <div className={`${styles.field} ${styles.fullWidth}`}>
                <label>Description</label>
                <textarea
                  name="description"
                  placeholder="Write a detailed description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="6"
                  required
                />
              </div>
            </div>

            <div className={styles.actionRow}>
              <button type="submit" disabled={loading} className={styles.primaryBtn}>
                {loading
                  ? editMode
                    ? "Updating..."
                    : "Uploading..."
                  : editMode
                  ? "Update Listing"
                  : "Upload Listing"}
              </button>

              <button
                type="button"
                className={styles.secondaryBtn}
                onClick={() => navigate("/mylisting")}
              >
                Cancel
              </button>
            </div>
          </form>

          {message && <p className={styles.message}>{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default UploadListing;