import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";
import logo from "./logo.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Check for login status from localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
    }
  }, [location.pathname]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
    setShowDropdown(false);
    navigate("/");
  };

  const isActive = (path) => location.pathname === path ? styles.active : "";

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        {/* Left Side - Logo */}
        <div className={styles.logo}>
  <Link to="/">
    <img src={logo} alt="Logo" />
  </Link>
</div>

        {/* Middle - Navigation Links */}
        <ul className={`${styles.navLinks} ${isOpen ? styles.showMenu : ""}`}>
          <li><Link to="/" className={isActive("/")}>Home</Link></li>
          <li><Link to="/mylisting" className={isActive("/mylisting")}>MyListing</Link></li>
          <li><Link to="/message" className={isActive("/message")}>Messages</Link></li>
          <li><Link to="/contact" className={isActive("/contact")}>Contact Us</Link></li>
        </ul>

        {/* Right Side - Login / User Profile */}
        <div className={styles.rightSide}>
          {isLoggedIn ? (
            <div className={styles.userMenu}>
              <button className={styles.userBtn} onClick={toggleDropdown}>
                <span className={styles.userIcon}>
                  <i className="bi bi-person-circle"></i>
                </span>
                <span className={styles.userName}>{user?.name || "User"}</span>
                <i className="bi bi-chevron-down"></i>
              </button>
              {showDropdown && (
                <div className={styles.dropdown}>
                  <Link to="/profile" className={styles.dropdownItem} onClick={() => setShowDropdown(false)}>
                    <i className="bi bi-person"></i> Profile
                  </Link>
                  <Link to="/mylisting" className={styles.dropdownItem} onClick={() => setShowDropdown(false)}>
                    <i className="bi bi-card-list"></i> My Listings
                  </Link>
                  <button className={styles.dropdownItem} onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right"></i> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className={styles.loginBtn}>
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button className={styles.menuToggle} onClick={toggleMenu}>
          ☰
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

