import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";

const ProtectedRoute = ({ element }) => {
  const { authToken } = useContext(AuthContext);

  return authToken ? element : <Navigate to="/login" replace />;
};

export default ProtectedRoute;