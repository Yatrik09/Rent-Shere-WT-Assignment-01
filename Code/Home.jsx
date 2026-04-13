import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Home.module.css";

const categoryOptions = [
  "all",
  "Car",
  "Bike",
  "Tool",
  "Camera",
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

function Home() {
  const [listingsData, setListingsData] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [locationText, setLocationText] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [sortPrice, setSortPrice] = useState("default");
  const [filterLocation, setFilterLocation] = useState("");

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  const searchInputRef = useRef(null);
  const navigate = useNavigate();

  const fetchListings = async () => {
    try {
      setLoading(true);
      setFetchError("");

      const response = await fetch("http://localhost:5000/api/listings");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch listings");
      }

      const listings = Array.isArray(data) ? data : [];
      setListingsData(listings);
      setFilteredListings(listings);
    } catch (error) {
      console.error("Error fetching home listings:", error);
      setFetchError("Unable to load listings right now.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  useEffect(() => {
    const allSuggestions = [
      ...new Set(
        listingsData
          .map((item) => item?.title?.trim())
          .filter(Boolean)
      )
    ];

    if (searchText.trim().length > 0) {
      const filtered = allSuggestions
        .filter((item) =>
          item.toLowerCase().includes(searchText.toLowerCase())
        )
        .slice(0, 8);

      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchText, listingsData]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }

      const dropdown = document.getElementById("custom-category-dropdown");
      if (dropdown && !dropdown.contains(event.target)) {
        setShowCategoryDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return function () {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function applyFilters(customSearch = searchText, customLocation = locationText) {
    let filtered = [...listingsData];

    if (customSearch) {
      filtered = filtered.filter(function (item) {
        const title = item?.title?.toLowerCase() || "";
        const category = item?.category?.toLowerCase() || "";
        const location = item?.location?.toLowerCase() || "";

        return (
          title.includes(customSearch.toLowerCase()) ||
          category.includes(customSearch.toLowerCase()) ||
          location.includes(customSearch.toLowerCase())
        );
      });
    }

    if (customLocation) {
      filtered = filtered.filter(function (item) {
        return (item?.location || "")
          .toLowerCase()
          .includes(customLocation.toLowerCase());
      });
    }

    if (filterCategory && filterCategory !== "all") {
      filtered = filtered.filter(function (item) {
        return (item?.category || "").toLowerCase() === filterCategory.toLowerCase();
      });
    }

    if (filterLocation) {
      filtered = filtered.filter(function (item) {
        return (item?.location || "")
          .toLowerCase()
          .includes(filterLocation.toLowerCase());
      });
    }

    if (sortPrice === "lowToHigh") {
      filtered.sort(function (a, b) {
        return (a.pricePerDay || 0) - (b.pricePerDay || 0);
      });
    } else if (sortPrice === "highToLow") {
      filtered.sort(function (a, b) {
        return (b.pricePerDay || 0) - (a.pricePerDay || 0);
      });
    }

    setFilteredListings(filtered);
  }

  useEffect(() => {
    applyFilters();
  }, [filterCategory, sortPrice, filterLocation, listingsData]);

  function resetFilters() {
    setFilterCategory("all");
    setSortPrice("default");
    setFilterLocation("");
    setSearchText("");
    setLocationText("");
    setShowSuggestions(false);
    setFilteredListings(listingsData);
  }

  function handleSearch(e) {
    e.preventDefault();
    applyFilters(searchText, locationText);
    setShowSuggestions(false);
  }

  function handleSuggestionClick(suggestion) {
    setSearchText(suggestion);
    setShowSuggestions(false);
    applyFilters(suggestion, locationText);
  }

  function handleRentNow(item) {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Kindly login to continue");
      navigate("/login");
      return;
    }

    navigate(`/listing/${item._id}`);
  }

  function handleViewDetails(item) {
    navigate(`/listing/${item._id}`);
  }

  const renderListingCard = (item) => {
    return (
      <article key={item._id}>
        <div className={styles.imageWrapper}>
          {item.images && item.images.length > 0 ? (
            <img
              src={item.images[0]}
              alt={item.title}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <span className={styles.itemName}>{item.title}</span>
          )}

          <span className={styles.category}>{item.category}</span>
          <span className={styles.price}>₹{item.pricePerDay}/day</span>
        </div>

        <div className={styles.content}>
          <h4>{item.title}</h4>
          <p className={styles.location}>{item.location}</p>
          <p>{item.condition}</p>
          <p>
            <strong>Deposit:</strong> ₹{item.securityDeposit}
          </p>

          <div className={styles.buttons}>
            <button onClick={() => handleViewDetails(item)}>View Details</button>
            <button onClick={() => handleRentNow(item)}>Rent Now</button>
          </div>
        </div>
      </article>
    );
  };

 const heroSection = (
  <section className={styles.heroSection}>
    <h2>Find Nearby Rentals & Shared Items</h2>
    <p>Discover vehicles, electronics, tools, party items and more from real users</p>

    <form onSubmit={handleSearch}>
      <div
        className={styles.searchWrapper}
        ref={searchInputRef}
        style={{ position: "relative" }}
      >
        <input
          type="text"
          placeholder="What are you looking for?"
          value={searchText}
          onChange={function (e) {
            setSearchText(e.target.value);
          }}
          onFocus={function () {
            if (searchText.trim().length > 0 && suggestions.length > 0) {
              setShowSuggestions(true);
            }
          }}
        />

        {showSuggestions && suggestions.length > 0 && (
          <div className={styles.suggestionsDropdown}>
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className={styles.suggestionItem}
              >
                {suggestion}
              </div>
            ))}
          </div>
        )}
      </div>

      <input
        type="text"
        placeholder="Location (e.g. Ahmedabad)"
        value={locationText}
        onChange={function (e) {
          setLocationText(e.target.value);
        }}
      />

      <button type="submit">Search</button>
    </form>
  </section>
);
  const filterSidebar = (
    <aside className={styles.filterSidebar}>
      <h3>Filters</h3>

      <label>Category</label>

      <div
        id="custom-category-dropdown"
        style={{ position: "relative", marginBottom: "18px" }}
      >
        <div
          onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
          style={{
            width: "100%",
            padding: "14px 16px",
            borderRadius: "14px",
            border: "1px solid #ddd",
            background: "#fff",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            cursor: "pointer",
            fontSize: "15px",
            color: "#333"
          }}
        >
          <span>
            {filterCategory === "all" ? "All Categories" : filterCategory}
          </span>
          <i
            className={`bi ${
              showCategoryDropdown ? "bi-chevron-up" : "bi-chevron-down"
            }`}
          ></i>
        </div>

        {showCategoryDropdown && (
          <div
            style={{
              position: "absolute",
              top: "105%",
              left: 0,
              width: "100%",
              background: "#fff",
              border: "1px solid #ddd",
              borderRadius: "14px",
              boxShadow: "0 10px 24px rgba(0,0,0,0.08)",
              zIndex: 20,
              maxHeight: "240px",
              overflowY: "auto"
            }}
          >
            {categoryOptions.map((cat, index) => (
              <div
                key={index}
                onClick={() => {
                  setFilterCategory(cat);
                  setShowCategoryDropdown(false);
                }}
                style={{
                  padding: "12px 16px",
                  cursor: "pointer",
                  fontSize: "15px",
                  color: "#333",
                  borderBottom:
                    index !== categoryOptions.length - 1
                      ? "1px solid #f1f1f1"
                      : "none",
                  background:
                    filterCategory === cat ? "#f0f7ff" : "#fff"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#f7f9fc";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background =
                    filterCategory === cat ? "#f0f7ff" : "#fff";
                }}
              >
                {cat === "all" ? "All Categories" : cat}
              </div>
            ))}
          </div>
        )}
      </div>

      <label>Sort by Price</label>
      <select
        value={sortPrice}
        onChange={function (e) {
          setSortPrice(e.target.value);
        }}
      >
        <option value="default">Default</option>
        <option value="lowToHigh">Low to High</option>
        <option value="highToLow">High to Low</option>
      </select>

      <label>Location</label>
      <input
        type="text"
        placeholder="Enter location"
        value={filterLocation}
        onChange={function (e) {
          setFilterLocation(e.target.value);
        }}
      />

      <button onClick={applyFilters}>Apply Filters</button>
      <button onClick={resetFilters}>Reset</button>
    </aside>
  );

  const listingsSection = (
    <section className={styles.listingsSection}>
      <h3>Featured Listings</h3>

      {loading && <p>Loading listings...</p>}
      {fetchError && <p>{fetchError}</p>}

      {!loading && !fetchError && filteredListings.length === 0 ? (
        <div className={styles.noResults}>
          <h4>No listings found</h4>
          <p>Try adjusting your filters or search criteria</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {filteredListings.map((item) => renderListingCard(item))}
        </div>
      )}
    </section>
  );

  const mainContent = (
    <section className={styles.mainContent}>
      {filterSidebar}
      <div style={{ width: "100%" }}>
        {listingsSection}
      </div>
    </section>
  );

  return (
    <main>
      {heroSection}
      {mainContent}
    </main>
  );
}

export default Home;