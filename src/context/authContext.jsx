import { createContext, useState } from "react";
import Cookies from "js-cookie";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [adminLoggedIn, setAdminLoggedIn] = useState(
    !!Cookies.get("adminToken")
  );
  const [managerLoggedIn, setManagerLoggedIn] = useState(
    !!Cookies.get("managerToken")
  );

  const loginAsAdmin = (token) => {
    Cookies.set("adminToken", token);
    setAdminLoggedIn(true);
    window.location.href = "/dashboard";
  };

  const loginAsManager = (token) => {
    Cookies.set("managerToken", token);
    setManagerLoggedIn(true);
    window.location.href = "/dashboard";
  };

  const logout = () => {
    Cookies.remove("adminToken");
    Cookies.remove("managerToken");
    setAdminLoggedIn(false);
    setManagerLoggedIn(false);
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider
      value={{
        adminLoggedIn,
        managerLoggedIn,
        loginAsAdmin,
        loginAsManager,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
