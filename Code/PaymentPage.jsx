import React, { useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import QR from "./QR.jpeg";

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  const [duration, setDuration] = useState(1);
  const [rentalType, setRentalType] = useState("day");
  const [paymentScreenshot, setPaymentScreenshot] = useState(null);

  const listing = location.state?.listing;

  if (!listing) {
    return (
      <div style={pageStyle}>
        <div style={cardStyle}>
          <h2>Payment Page</h2>
          <p>
            Listing data not found. Please go back and select the item again.
          </p>
          <button
            style={buttonStyle}
            onClick={() => navigate(`/listing/${id}`)}
          >
            Back to Listing
          </button>
        </div>
      </div>
    );
  }

  const rentAmount = useMemo(() => {
    const price =
      rentalType === "hour"
        ? Number(listing.pricePerHour || 0)
        : Number(listing.pricePerDay || 0);

    return price * Number(duration || 1);
  }, [listing, rentalType, duration]);

  const totalAmount = rentAmount + Number(listing.securityDeposit || 0);

  const handleSubmitPayment = (e) => {
    e.preventDefault();

    if (!paymentScreenshot) {
      alert("Please upload payment screenshot");
      return;
    }

    alert(
      "Payment proof submitted successfully. Booking will remain pending verification.",
    );
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h2 style={{ marginBottom: "20px" }}>Complete Booking Payment</h2>

        <div style={sectionStyle}>
          <h3 style={sectionTitle}>Item Details</h3>
          <p>
            <strong>Item:</strong> {listing.title}
          </p>
          <p>
            <strong>Location:</strong> {listing.location}
          </p>
          <p>
            <strong>Owner:</strong> {listing.user?.name || "Not available"}
          </p>
        </div>

        <div style={sectionStyle}>
          <h3 style={sectionTitle}>Select Booking</h3>

          <div style={rowStyle}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Rental Type</label>
              <select
                value={rentalType}
                onChange={(e) => setRentalType(e.target.value)}
                style={inputStyle}
              >
                <option value="day">Per Day</option>
                <option value="hour">Per Hour</option>
              </select>
            </div>

            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Duration</label>
              <input
                type="number"
                min="1"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>
        </div>

        <div style={sectionStyle}>
          <h3 style={sectionTitle}>Payment Summary</h3>
          <p>
            <strong>Rent Amount:</strong> ₹{rentAmount}
          </p>
          <p>
            <strong>Security Deposit:</strong> ₹{listing.securityDeposit}
          </p>
          <p style={totalStyle}>
            <strong>Total Amount:</strong> ₹{totalAmount}
          </p>
        </div>

        <div style={sectionStyle}>
          <h3 style={sectionTitle}>Pay by UPI</h3>

          <div style={upiBoxStyle}>
            <p>
              <strong>UPI ID:</strong>8128070702@upi
            </p>
            <p style={{ marginTop: "8px" }}>
              Scan the QR code below and pay the total amount.
            </p>

            <img src={QR} alt="UPI QR Code" style={qrImageStyle} />
          </div>
        </div>

        <form onSubmit={handleSubmitPayment}>
          <div style={sectionStyle}>
            <h3 style={sectionTitle}>Upload Payment Screenshot</h3>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setPaymentScreenshot(e.target.files[0])}
              style={inputStyle}
            />
          </div>

          <div style={buttonRowStyle}>
            <button type="submit" style={buttonStyle}>
              Submit Payment Proof
            </button>

            <button
              type="button"
              style={secondaryButtonStyle}
              onClick={() => navigate(`/listing/${listing._id}`)}
            >
              Back
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const pageStyle = {
  maxWidth: "900px",
  margin: "30px auto",
  padding: "20px",
};

const cardStyle = {
  background: "#fff",
  borderRadius: "20px",
  padding: "28px",
  boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
};

const sectionStyle = {
  marginBottom: "24px",
  padding: "18px",
  borderRadius: "14px",
  background: "#f8f9fa",
};

const sectionTitle = {
  marginBottom: "12px",
  color: "#1a1a2e",
};

const rowStyle = {
  display: "flex",
  gap: "16px",
  flexWrap: "wrap",
};

const labelStyle = {
  display: "block",
  marginBottom: "8px",
  fontWeight: "600",
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  borderRadius: "10px",
  border: "1px solid #ddd",
  outline: "none",
};

const totalStyle = {
  fontSize: "18px",
  color: "#0066cc",
  fontWeight: "700",
};

const upiBoxStyle = {
  padding: "12px",
  borderRadius: "12px",
  background: "#fff",
};

const qrWrapperStyle = {
  marginTop: "16px",
  display: "flex",
  justifyContent: "center",
};

const qrImageStyle = {
  width: "220px",
  height: "220px",
  objectFit: "contain",
  borderRadius: "12px",
  border: "1px solid #ddd",
};

const buttonRowStyle = {
  display: "flex",
  gap: "12px",
  flexWrap: "wrap",
};

const buttonStyle = {
  background: "linear-gradient(135deg,#0066cc,#0099ff)",
  color: "#fff",
  border: "none",
  padding: "12px 18px",
  borderRadius: "12px",
  fontWeight: "600",
  cursor: "pointer",
};

const secondaryButtonStyle = {
  background: "#f0f2f5",
  color: "#333",
  border: "none",
  padding: "12px 18px",
  borderRadius: "12px",
  fontWeight: "600",
  cursor: "pointer",
};

export default PaymentPage;
