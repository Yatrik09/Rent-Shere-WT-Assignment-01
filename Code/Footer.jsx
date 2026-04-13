import React from "react";
import { useLocation } from "react-router-dom";       
import "./Footer.css";

const Footer = () => {
  const location = useLocation();
  
  if (location.pathname === "/login" || location.pathname === "/sign") {
    return null;
  }

  return React.createElement("footer", { className: "footer" },
    React.createElement("div", { className: "footer-container" },
      React.createElement("div", { className: "footer-section" },
        React.createElement("h2", { className: "footer-title" }, "About Us"),
        React.createElement("p", null, "Your local neighborhood hub for renting everything from heavy materials to small items, available right where you live and in areas near you.")
      ),
      React.createElement("div", { className: "footer-section" },
        React.createElement("h2", { className: "footer-title" }, "Quick Links"),
        React.createElement("ul", null, 
          React.createElement("li", null, React.createElement("a", { href: "/" }, "Home")),
          React.createElement("li", null, React.createElement("a", { href: "/mylisting" }, "My Listing")),
          React.createElement("li", null, React.createElement("a", { href: "/message" }, "Message")),
          React.createElement("li", null, React.createElement("a", { href: "/contact" }, "Contact Us"))
        )
      ),
      React.createElement("div", { className: "footer-section" },
        React.createElement("h2", { className: "footer-title" }, "Contact Us"),
        React.createElement("div", { className: "contact-info" },
          React.createElement("p", null, "support@lrent&share.com"),
          React.createElement("p", null, "+91 98752 34792"),
          React.createElement("p", null, "Ahmedabad, Gujarat")
        )
      ),
      React.createElement("div", { className: "footer-section" },
        React.createElement("h2", { className: "footer-title" }, "Follow Us"),
        React.createElement("div", { className: "social-icons" },
          React.createElement("a", { 
            href: "https://www.facebook.com/share/18u7TuG7BW/", 
            target: "_blank", 
            rel: "noopener noreferrer",
            className: "social-facebook"
          }, "f"),
          React.createElement("a", { 
            href: "https://x.com/ultimateTG4?t=BGLGX5nXErHNe2En4BogIw&s=09", 
            target: "_blank", 
            rel: "noopener noreferrer",
            className: "social-x"
          }, "𝕏"),
          React.createElement("a", { 
            href: "https://www.instagram.com/ultimate_tour_guide4?igsh=MWJhdTc5djlzbnFq", 
            target: "_blank", 
            rel: "noopener noreferrer",
            className: "social-instagram"
          }, "📷"),
          React.createElement("a", { 
            href: "#", 
            target: "_blank", 
            rel: "noopener noreferrer",
            className: "social-linkedin"
          }, "in")
        )
      )
    ),
    React.createElement("div", { className: "footer-bottom" },
      React.createElement("p", null, "© 2026 rent & share | All Rights Reserved.")
    )
  );
};

export default Footer;
