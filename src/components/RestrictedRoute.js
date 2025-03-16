import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";

const RestrictedRoute = ({ element }) => {
  const { authToken } = useContext(AuthContext);

  return authToken ? <Navigate to="/home" replace /> : element;
};

export default RestrictedRoute;
