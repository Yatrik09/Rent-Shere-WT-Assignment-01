import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaEdit,
  FaPlus,
  FaList,
  FaSignOutAlt,
  FaCamera,
  FaComments
} from "react-icons/fa";
import styles from "./Profile.module.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    activeListings: 0,
    totalChats: 0,
    totalRentals: 0
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: ""
  });

  const navigate = useNavigate();

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("user");

        if (!token || !userData) {
          navigate("/login");
          return;
        }

        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);

        setFormData({
          name: parsedUser.name || "",
          email: parsedUser.email || "",
          phone: parsedUser.phone || "",
          address: parsedUser.address || "",
          city: parsedUser.city || ""
        });

        let activeListings = 0;
        let totalChats = 0;

        try {
          const listingsRes = await fetch("http://localhost:5000/api/listings/my-listings", {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          const listingsData = await listingsRes.json();

          if (listingsRes.ok && Array.isArray(listingsData)) {
            activeListings = listingsData.length;
          }
        } catch (error) {
          console.error("Error fetching listings stats:", error);
        }

        try {
          const chatRes = await fetch("http://localhost:5000/api/chat/conversations", {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          const chatData = await chatRes.json();

          if (chatRes.ok && Array.isArray(chatData)) {
            totalChats = chatData.length;
          }
        } catch (error) {
          console.error("Error fetching chat stats:", error);
        }

        setStats({
          activeListings,
          totalChats,
          totalRentals: 0
        });
      } catch (error) {
        console.error("Profile load error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    const updatedUser = { ...user, ...formData };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
    setIsEditing(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  const getMemberSince = () => {
    if (user?.createdAt) {
      return new Date(user.createdAt).getFullYear();
    }
    return new Date().getFullYear();
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={styles.loading}>
        <p>User not found. Please login again.</p>
      </div>
    );
  }

  return (
    <div className={styles.profilePage}>
      <div className={styles.heroSection}>
        <div className={styles.heroContent}>
          <div className={styles.avatarWrapper}>
            <div className={styles.avatar}>
              {user.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
            <button className={styles.cameraBtn}>
              <FaCamera />
            </button>
          </div>

          <h1>{user.name || "User"}</h1>
          <p className={styles.memberSince}>Member since {getMemberSince()}</p>
        </div>
      </div>

      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2><FaUser /> Personal Information</h2>
              <button
                className={styles.editBtn}
                onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
              >
                {isEditing ? "Save" : <><FaEdit /> Edit</>}
              </button>
            </div>

            <div className={styles.cardBody}>
              {isEditing ? (
                <div className={styles.form}>
                  <div className={styles.formGroup}>
                    <label>Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your name"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Address</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Enter your address"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Enter your city"
                    />
                  </div>
                </div>
              ) : (
                <div className={styles.infoList}>
                  <div className={styles.infoItem}>
                    <div className={styles.infoIcon}>
                      <FaUser />
                    </div>
                    <div className={styles.infoContent}>
                      <label>Full Name</label>
                      <p>{user.name || "Not set"}</p>
                    </div>
                  </div>

                  <div className={styles.infoItem}>
                    <div className={styles.infoIcon}>
                      <FaEnvelope />
                    </div>
                    <div className={styles.infoContent}>
                      <label>Email Address</label>
                      <p>{user.email || "Not set"}</p>
                    </div>
                  </div>

                  <div className={styles.infoItem}>
                    <div className={styles.infoIcon}>
                      <FaPhone />
                    </div>
                    <div className={styles.infoContent}>
                      <label>Phone Number</label>
                      <p>{user.phone || "Not set"}</p>
                    </div>
                  </div>

                  <div className={styles.infoItem}>
                    <div className={styles.infoIcon}>
                      <FaMapMarkerAlt />
                    </div>
                    <div className={styles.infoContent}>
                      <label>Address</label>
                      <p>{user.address || "Not set"}</p>
                    </div>
                  </div>

                  <div className={styles.infoItem}>
                    <div className={styles.infoIcon}>
                      <FaMapMarkerAlt />
                    </div>
                    <div className={styles.infoContent}>
                      <label>City</label>
                      <p>{user.city || "Not set"}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2>Quick Actions</h2>
            </div>

            <div className={styles.cardBody}>
              <div className={styles.actionList}>
                <Link to="/upload-listing" className={styles.actionItem}>
                  <div className={styles.actionIcon}>
                    <FaPlus />
                  </div>
                  <div className={styles.actionContent}>
                    <h3>Add New Listing</h3>
                    <p>List your item for rent</p>
                  </div>
                </Link>

                <Link to="/mylisting" className={styles.actionItem}>
                  <div className={styles.actionIcon}>
                    <FaList />
                  </div>
                  <div className={styles.actionContent}>
                    <h3>My Listings</h3>
                    <p>View and manage your items</p>
                  </div>
                </Link>

                <Link to="/message" className={styles.actionItem}>
                  <div className={styles.actionIcon}>
                    <FaComments />
                  </div>
                  <div className={styles.actionContent}>
                    <h3>Messages</h3>
                    <p>Check your conversations</p>
                  </div>
                </Link>

                <button onClick={handleLogout} className={styles.actionItem}>
                  <div className={`${styles.actionIcon} ${styles.logoutIcon}`}>
                    <FaSignOutAlt />
                  </div>
                  <div className={styles.actionContent}>
                    <h3>Logout</h3>
                    <p>Sign out of your account</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.statsSection}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <FaList />
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{stats.activeListings}</span>
              <span className={styles.statLabel}>Active Listings</span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <FaComments />
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{stats.totalChats}</span>
              <span className={styles.statLabel}>Total Chats</span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <FaUser />
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{stats.totalRentals}</span>
              <span className={styles.statLabel}>Total Rentals</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;