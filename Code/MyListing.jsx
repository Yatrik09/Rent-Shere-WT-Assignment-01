import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./MyListing.module.css";

const categories = [
  "All",
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

function MyListing() {
  const navigate = useNavigate();

  const [listingsData, setListingsData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  const searchInputRef = useRef(null);

  const fetchMyListings = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Kindly login to continue");
        navigate("/login");
        return;
      }

      setLoading(true);
      setFetchError("");

      const res = await fetch("http://localhost:5000/api/listings/my-listings", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch your listings");
      }

      setListingsData(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setFetchError("Unable to load your listings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyListings();
  }, []);

  useEffect(() => {
    const allSuggestions = [
      ...new Set(
        listingsData
          .map((item) => item?.title?.toLowerCase())
          .filter(Boolean)
      )
    ];

    if (searchQuery.length > 0) {
      const filtered = allSuggestions
        .filter((s) => s.includes(searchQuery.toLowerCase()))
        .slice(0, 8);

      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery, listingsData]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSuggestionClick = (value) => {
    setSearchQuery(value);
    setShowSuggestions(false);
  };

  const filteredListings = listingsData.filter((item) => {
    const title = item?.title?.toLowerCase() || "";
    const category = item?.category?.toLowerCase() || "";
    const location = item?.location?.toLowerCase() || "";

    const searchMatch =
      title.includes(searchQuery.toLowerCase()) ||
      category.includes(searchQuery.toLowerCase()) ||
      location.includes(searchQuery.toLowerCase());

    const categoryMatch =
      selectedCategory === "All" ||
      category === selectedCategory.toLowerCase();

    return searchMatch && categoryMatch;
  });

  const handleEditListing = (item) => {
    navigate("/upload-listing", {
      state: {
        editMode: true,
        listing: item
      }
    });
  };

  const handleDeleteListing = async (id) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Kindly login to continue");
      navigate("/login");
      return;
    }

    const confirmDelete = window.confirm("Are you sure you want to delete this item?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://localhost:5000/api/listings/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to delete listing");
      }

      alert("Listing deleted successfully");
      fetchMyListings();
    } catch (error) {
      console.error(error);
      alert(error.message || "Failed to delete listing");
    }
  };

  const handleAddItem = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Kindly login to add item");
      navigate("/login");
      return;
    }

    navigate("/upload-listing");
  };

  return (
    <main>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>My Listings</h1>
          <p className={styles.heroSubtitle}>
            Manage the items you have uploaded
          </p>

          <div className={styles.searchBarWrapper} ref={searchInputRef}>
            <div className={styles.searchBar}>
              <i className="bi bi-search"></i>
              <input
                type="text"
                placeholder="Search your items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {showSuggestions && suggestions.length > 0 && (
              <ul className={styles.suggestionsList}>
                {suggestions.map((s, i) => (
                  <li key={i} onClick={() => handleSuggestionClick(s)}>
                    {s}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      <div style={{ maxWidth: "1200px", margin: "20px auto", padding: "0 20px" }}>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ddd",
            fontSize: "14px"
          }}
        >
          {categories.map((cat, i) => (
            <option key={i}>{cat}</option>
          ))}
        </select>
      </div>

      <section className={styles.featured}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <h3>My Uploaded Items</h3>

          <button
            onClick={handleAddItem}
            style={{
              background: "linear-gradient(135deg,#0066cc,#0099ff)",
              color: "#fff",
              border: "none",
              padding: "10px 16px",
              borderRadius: "10px",
              fontWeight: "600",
              cursor: "pointer"
            }}
          >
            + Add Item
          </button>
        </div>

        {loading && <p>Loading your listings...</p>}
        {fetchError && <p>{fetchError}</p>}

        {!loading && filteredListings.length === 0 && (
          <p>You have not added any items yet.</p>
        )}

        {!loading && filteredListings.length > 0 && (
          <div className={styles.listingGrid}>
            {filteredListings.map((item) => (
              <article key={item._id}>
                <div className={styles.imageWrapper}>
                  {item.images?.length > 0 ? (
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover"
                      }}
                    />
                  ) : (
                    <span className={styles.itemName}>{item.title}</span>
                  )}

                  <span className={styles.category}>{item.category}</span>
                  <span className={styles.price}>₹{item.pricePerDay} / day</span>
                </div>

                <div className={styles.content}>
                  <h4>{item.title}</h4>
                  <p>{item.location}</p>
                  <p>{item.condition}</p>
                  <p><strong>Deposit:</strong> ₹{item.securityDeposit}</p>

                  <div className={styles.cardActions}>
                    <button onClick={() => handleEditListing(item)}>
                      Edit
                    </button>
                    <button onClick={() => handleDeleteListing(item._id)}>
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default MyListing;