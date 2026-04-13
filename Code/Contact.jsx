import React, { useState } from "react";
import styles from "./Contact.module.css";

function Contact() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    subject: "",
    message: ""
  });
  const [submitText, setSubmitText] = useState("Send Message");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(e) {
    var name = e.target.name;
    var value = e.target.value;
    setFormData(function(prev) {
      var _a;
      return (_a = {}, _a[name] = value, _a);
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitText("Sending...");
    
    setTimeout(function() {
      setSubmitText("Message Sent ✔");
      setFormData({ fullName: "", email: "", subject: "", message: "" });
      
      setTimeout(function() {
        setSubmitText("Send Message");
        setIsSubmitting(false);
      }, 2000);
    }, 1200);
  }

  var buttonStyle = isSubmitting ? { pointerEvents: "none" } : {};

  var contactHero = React.createElement("section", { className: styles.contactHero },
    React.createElement("h2", null, "Contact Us"),
    React.createElement("p", null, "We're here to help you rent & share with confidence")
  );

  var contactInfo = React.createElement("div", { className: styles.contactInfo },
    React.createElement("h3", null, "Get in Touch"),
    React.createElement("div", { className: styles.infoBox },
      React.createElement("strong", null, "📞 Phone"),
      React.createElement("p", null, "+91 98765 43210")
    ),
    React.createElement("div", { className: styles.infoBox },
      React.createElement("strong", null, "📧 Email"),
      React.createElement("p", null, "support@rentandshare.com")
    ),
    React.createElement("div", { className: styles.infoBox },
      React.createElement("strong", null, "📍 Address"),
      React.createElement("p", null, "Ahmedabad, Gujarat, India")
    ),
    React.createElement("div", { className: styles.infoBox },
      React.createElement("strong", null, "⏰ Support Hours"),
      React.createElement("p", null, "Mon – Sat: 9:00 AM – 8:00 PM")
    )
  );

  var contactForm = React.createElement("div", { className: styles.contactForm },
    React.createElement("h3", null, "Send Us a Message"),
    React.createElement("form", { onSubmit: handleSubmit },
      React.createElement("label", null, "Full Name"),
      React.createElement("input", { 
        type: "text", 
        placeholder: "Enter your name", 
        name: "fullName",
        value: formData.fullName, 
        onChange: handleChange,
        required: true 
      }),
      React.createElement("label", null, "Email Address"),
      React.createElement("input", { 
        type: "email", 
        placeholder: "Enter your email", 
        name: "email",
        value: formData.email, 
        onChange: handleChange,
        required: true 
      }),
      React.createElement("label", null, "Subject"),
      React.createElement("select", { 
        name: "subject",
        value: formData.subject, 
        onChange: handleChange,
        required: true 
      },
        React.createElement("option", { value: "" }, "Select subject"),
        React.createElement("option", { value: "General Inquiry" }, "General Inquiry"),
        React.createElement("option", { value: "Booking Issue" }, "Booking Issue"),
        React.createElement("option", { value: "Payment Problem" }, "Payment Problem"),
        React.createElement("option", { value: "Account Support" }, "Account Support")
      ),
      React.createElement("label", null, "Message"),
      React.createElement("textarea", { 
        rows: "5", 
        placeholder: "Write your message...", 
        name: "message",
        value: formData.message, 
        onChange: handleChange,
        required: true 
      }),
      React.createElement("button", { 
        type: "submit",
        style: buttonStyle
      }, submitText)
    )
  );

  var contactWrapper = React.createElement("section", { className: styles.contactWrapper },
    contactInfo,
    contactForm
  );

  return React.createElement("main", null, contactHero, contactWrapper);
}

export default Contact;
