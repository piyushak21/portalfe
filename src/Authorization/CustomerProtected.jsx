import React from "react";
import { Navigate } from "react-router-dom";

const CustomerProtected = ({ children }) => {
  const token = localStorage.getItem("token");
  let user_type = localStorage.getItem("user_type");

  if (user_type === "2" && token) {
    return children;
  } else {
    return <Navigate to="/" />;
  }
};

export default CustomerProtected;
