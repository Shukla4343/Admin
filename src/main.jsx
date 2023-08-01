import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import NavBar from "./components/navbar";
import { AuthProvider } from "./context/authContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <div>
    <AuthProvider>
      <NavBar />
      <App />
    </AuthProvider>
  </div>
);
