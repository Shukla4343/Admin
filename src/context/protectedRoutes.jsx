import React from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./authContext";

const ProtectedRoute = ({
  component: Component,
  adminOnly,
  managerOnly,
  ...rest
}) => {
  const { adminLoggedIn, managerLoggedIn } = React.useContext(AuthContext);

  if (adminOnly && adminLoggedIn) {
    return <Component {...rest} />;
  }

  if (managerOnly && (adminLoggedIn || managerLoggedIn)) {
    return <Component {...rest} />;
  }

  return <Navigate to="/" />;
};

export default ProtectedRoute;
