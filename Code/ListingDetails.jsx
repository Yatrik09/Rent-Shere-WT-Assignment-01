import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ListingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState("");

  useEffect(() => {
    const fetchListingDetails = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(`http://localhost:5000/api/listings/${id}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch listing details");
        }

        setListing(data);

        if (data.images && data.images.length > 0) {
          setSelectedImage(data.images[0]);
        }
      } catch (err) {
        console.error(err);
        setError("Unable to load listing details.");
      } finally {
        setLoading(false);
      }
    };

    fetchListingDetails();
  }, [id]);

  const handleBookNow = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Kindly login to continue");
      navigate("/login");
      return;
    }

    navigate(`/payment/${listing._id}`, {
      state: { listing }
    });
  };

  const handleChatWithOwner = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Kindly login to continue");
      navigate("/login");
      return;
    }

    navigate("/message", {
      state: {
        ownerId: listing?.user?._id,
        itemId: listing?._id,
        itemTitle: listing?.title,
        ownerName: listing?.user?.name
      }
    });
  };

  if (loading) {
    return <div style={pageStyle}><p>Loading listing details...</p></div>;
  }

  if (error) {
    return <div style={pageStyle}><p>{error}</p></div>;
  }

  if (!listing) {
    return <div style={pageStyle}><p>Listing not found.</p></div>;
  }

  return (
    <div style={pageStyle}>

      {/* 🔙 BACK BUTTON */}
      <button onClick={() => navigate("/")} style={backBtnStyle}>
  ← Back
</button>

      <div style={containerStyle}>
        <div style={leftStyle}>
          <div style={mainImageWrapper}>
            {selectedImage ? (
              <img
                src={selectedImage}
                alt={listing.title}
                style={mainImageStyle}
              />
            ) : (
              <div style={noImageStyle}>No Image Available</div>
            )}
          </div>

          {listing.images && listing.images.length > 1 && (
            <div style={thumbnailWrapper}>
              {listing.images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`thumb-${index}`}
                  onClick={() => setSelectedImage(img)}
                  style={{
                    ...thumbnailStyle,
                    border:
                      selectedImage === img
                        ? "2px solid #0066cc"
                        : "2px solid transparent"
                  }}
                />
              ))}
            </div>
          )}
        </div>

        <div style={rightStyle}>
          <h2 style={titleStyle}>{listing.title}</h2>

          <p style={textStyle}>
            <strong>Category:</strong> {listing.category}
          </p>

          <p style={textStyle}>
            <strong>Location:</strong> {listing.location}
          </p>

          <p style={textStyle}>
            <strong>Condition:</strong> {listing.condition}
          </p>

          <p style={textStyle}>
            <strong>Price Per Hour:</strong> ₹{listing.pricePerHour}
          </p>

          <p style={textStyle}>
            <strong>Price Per Day:</strong> ₹{listing.pricePerDay}
          </p>

          <p style={textStyle}>
            <strong>Minimum Rental Duration:</strong> {listing.minimumRentalDuration}
          </p>

          <p style={depositStyle}>
            <strong>Security Deposit:</strong> ₹{listing.securityDeposit}
          </p>

          <p style={descriptionStyle}>
            <strong>Description:</strong> {listing.description}
          </p>

          <div style={ownerBoxStyle}>
            <h4 style={{ marginBottom: "10px" }}>Owner Information</h4>
            <p style={textStyle}>
              <strong>Name:</strong> {listing.user?.name || "Not available"}
            </p>
            <p style={textStyle}>
              <strong>Email:</strong> {listing.user?.email || "Not available"}
            </p>
          </div>

          <div style={buttonWrapper}>
            <button style={bookBtnStyle} onClick={handleBookNow}>
              Book Now
            </button>

            <button style={chatBtnStyle} onClick={handleChatWithOwner}>
              Chat with Owner
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* 🔙 Back Button Style */
const backBtnStyle = {
  background: "transparent",
  border: "none",
  color: "#0066cc",
  fontSize: "16px",
  fontWeight: "600",
  cursor: "pointer",
  marginBottom: "15px"
};

const pageStyle = {
  maxWidth: "1300px",
  margin: "30px auto",
  padding: "20px"
};

const containerStyle = {
  display: "grid",
  gridTemplateColumns: "1.1fr 1fr",
  gap: "30px",
  background: "#fff",
  borderRadius: "20px",
  padding: "24px",
  boxShadow: "0 4px 20px rgba(0,0,0,0.06)"
};

const leftStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "14px"
};

const rightStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "10px"
};

const mainImageWrapper = {
  width: "100%",
  height: "420px",
  borderRadius: "18px",
  overflow: "hidden",
  background: "#f4f4f4"
};

const mainImageStyle = {
  width: "100%",
  height: "100%",
  objectFit: "cover"
};

const noImageStyle = {
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#666"
};

const thumbnailWrapper = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap"
};

const thumbnailStyle = {
  width: "90px",
  height: "90px",
  objectFit: "cover",
  borderRadius: "12px",
  cursor: "pointer"
};

const titleStyle = {
  fontSize: "30px",
  color: "#1a1a2e",
  marginBottom: "6px"
};

const textStyle = {
  fontSize: "15px",
  color: "#333",
  margin: 0
};

const depositStyle = {
  fontSize: "16px",
  color: "#0066cc",
  fontWeight: "600",
  margin: 0
};

const descriptionStyle = {
  fontSize: "15px",
  color: "#444",
  lineHeight: "1.7",
  marginTop: "10px"
};

const ownerBoxStyle = {
  marginTop: "14px",
  padding: "16px",
  borderRadius: "14px",
  background: "#f8f9fa"
};

const buttonWrapper = {
  display: "flex",
  gap: "12px",
  flexWrap: "wrap",
  marginTop: "18px"
};

const bookBtnStyle = {
  background: "linear-gradient(135deg,#0066cc,#0099ff)",
  color: "#fff",
  border: "none",
  padding: "12px 18px",
  borderRadius: "12px",
  fontWeight: "600",
  cursor: "pointer"
};

const chatBtnStyle = {
  background: "#f0f2f5",
  color: "#333",
  border: "none",
  padding: "12px 18px",
  borderRadius: "12px",
  fontWeight: "600",
  cursor: "pointer"
};

export default ListingDetails;