import React from "react";
import { Navigate } from "react-router-dom";

const AdminProtected = ({ children }) => {
  let token = localStorage.getItem("token");
  let user_type = localStorage.getItem("user_type");

  if (user_type === "1" && token) {
    return children;
  } else {
    return <Navigate to="/" />;
  }
};

export default AdminProtected;
