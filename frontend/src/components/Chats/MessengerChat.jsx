import React from "react";

const MessengerButton = () => {
  const pageUsername = "YOUR_PAGE_USERNAME"; // Thay bằng username Page của bạn
  const messengerLink = `https://m.me/${pageUsername}`;

  const styles = {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    backgroundColor: "#0084ff",
    color: "white",
    padding: "12px 16px",
    borderRadius: "50px",
    textDecoration: "none",
    fontWeight: "bold",
    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    zIndex: 1000,
  };

  const iconStyle = {
    marginRight: "8px",
    fontSize: "18px",
  };

  return (
    <a href={messengerLink} target="_blank" rel="noopener noreferrer" style={styles}>
      <span style={iconStyle}>💬</span>
      Chat with us
    </a>
  );
};

export default MessengerButton;
