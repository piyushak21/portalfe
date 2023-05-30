import React from "react";
import { Navigate } from "react-router-dom";

const LoginProtected = ({ children }) => {
  const token = localStorage.getItem("token");
  const user_type = localStorage.getItem("user_type");

  if (token) {
    if (user_type === "1") {
      return <Navigate to="/admin-dashboard" />;
    } else {
      return <Navigate to="/customer-dashboard" />;
    }
  } else {
    return children;
  }
};

export default LoginProtected;
