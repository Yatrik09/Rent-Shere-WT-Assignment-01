import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaCar,
  FaLaptop,
  FaBirthdayCake,
  FaTools,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt
} from "react-icons/fa";
import styles from "./login.module.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [nameError, setNameError] = useState("");
  const [serverMessage, setServerMessage] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const validateLogin = async (e) => {
    e.preventDefault();
    setEmailError("");
    setPasswordError("");
    setServerMessage("");

    if (!email) {
      setEmailError("Please enter your email");
      return;
    }

    if (!password) {
      setPasswordError("Please enter your password");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      const result = await response.json();

      if (!response.ok) {
        setServerMessage(result.message || "Login failed");
        return;
      }

      localStorage.setItem("token", result.token);
      localStorage.setItem("user", JSON.stringify(result.user));

      setServerMessage("Login successful");
      navigate("/mylisting");
    } catch (error) {
      console.error("Login error:", error);
      setServerMessage("Something went wrong while logging in");
    } finally {
      setLoading(false);
    }
  };

  const validateSignup = async (e) => {
    e.preventDefault();
    setNameError("");
    setEmailError("");
    setPasswordError("");
    setServerMessage("");

    if (!name) {
      setNameError("Please enter your name");
      return;
    }

    if (!email) {
      setEmailError("Please enter your email");
      return;
    }

    if (!password) {
      setPasswordError("Please enter a password");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          email,
          password
        })
      });

      const result = await response.json();

      if (!response.ok) {
        setServerMessage(result.message || "Signup failed");
        return;
      }

      setServerMessage("Signup successful. Please login now.");
      setIsLogin(true);
      setPassword("");
    } catch (error) {
      console.error("Signup error:", error);
      setServerMessage("Something went wrong while signing up");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.splitContainer}>
      <div className={styles.formSection}>
        <div className={styles.formCard}>
          <h2>{isLogin ? "Login" : "Sign Up"}</h2>

          <div className={styles.toggleButtons}>
            <button
              type="button"
              className={`${styles.toggleBtn} ${isLogin ? styles.active : ""}`}
              onClick={() => {
                setIsLogin(true);
                setServerMessage("");
              }}
            >
              Login
            </button>
            <button
              type="button"
              className={`${styles.toggleBtn} ${!isLogin ? styles.active : ""}`}
              onClick={() => {
                setIsLogin(false);
                setServerMessage("");
              }}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={isLogin ? validateLogin : validateSignup}>
            {!isLogin && (
              <div className={styles.inputGroup}>
                <label>Name:</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <p className={styles.errorText}>{nameError}</p>
              </div>
            )}

            <div className={styles.inputGroup}>
              <label>Email ID:</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <p className={styles.errorText}>{emailError}</p>
            </div>

            <div className={styles.inputGroup}>
              <label>Password:</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <p className={styles.errorText}>{passwordError}</p>
            </div>

            {isLogin && (
              <div className={styles.forgotPassword}>
                <span>Forgot Password?</span>
              </div>
            )}

            {serverMessage && (
              <p className={styles.errorText} style={{ marginBottom: "10px" }}>
                {serverMessage}
              </p>
            )}

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading
                ? isLogin
                  ? "Logging in..."
                  : "Signing up..."
                : isLogin
                ? "Login"
                : "Sign Up"}
            </button>
          </form>

          <div className={styles.switchText}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <span
              className={styles.switchLink}
              onClick={() => {
                setIsLogin(!isLogin);
                setServerMessage("");
              }}
            >
              {isLogin ? "Sign Up" : "Login"}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.infoSection}>
        <div className={styles.infoContent}>
          <div className={styles.logoSection}>
            <img src="/images/logo.jpg" alt="Rent & Share" />
            <div>
              <h1>Rent & Share</h1>
              <p className={styles.brandTagline}>Your Neighborhood Rental Hub</p>
            </div>
          </div>

          <h2>Welcome to Rent & Share</h2>
          <p className={styles.tagline}>
            Your local neighborhood hub for renting everything from heavy materials
            to small items, available right where you live and in areas near you.
          </p>

          <div className={styles.features}>
            <div className={styles.featureItem}>
              <div className={styles.featureIconBg}>
                <FaCar className={styles.featureIcon} />
              </div>
              <div className={styles.featureText}>
                <h3>Vehicles</h3>
                <p>Cars, bikes, scooters and more</p>
              </div>
            </div>

            <div className={styles.featureItem}>
              <div className={styles.featureIconBg}>
                <FaLaptop className={styles.featureIcon} />
              </div>
              <div className={styles.featureText}>
                <h3>Electronics</h3>
                <p>TVs, laptops, speakers and gadgets</p>
              </div>
            </div>

            <div className={styles.featureItem}>
              <div className={styles.featureIconBg}>
                <FaBirthdayCake className={styles.featureIcon} />
              </div>
              <div className={styles.featureText}>
                <h3>Party Items</h3>
                <p>Speakers, lights, decorations</p>
              </div>
            </div>

            <div className={styles.featureItem}>
              <div className={styles.featureIconBg}>
                <FaTools className={styles.featureIcon} />
              </div>
              <div className={styles.featureText}>
                <h3>Tools & Equipment</h3>
                <p>Power tools, generators and more</p>
              </div>
            </div>
          </div>

          <div className={styles.contactInfo}>
            <h3>Get In Touch</h3>
            <div className={styles.contactItem}>
              <FaEnvelope className={styles.contactIcon} />
              <span>support@rentandshare.com</span>
            </div>
            <div className={styles.contactItem}>
              <FaPhone className={styles.contactIcon} />
              <span>+91 98752 34792</span>
            </div>
            <div className={styles.contactItem}>
              <FaMapMarkerAlt className={styles.contactIcon} />
              <span>Ahmedabad, Gujarat, India</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;