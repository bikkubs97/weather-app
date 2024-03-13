import React, { createContext, useState, useEffect } from "react";
import Login from "./components/Login";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Signup from "./components/Signup";
import Navbar from "./components/Navbar";

// Step 1: Create a Context
export const TokenContext = createContext();

export default function App() {
  // Step 2: Check for 'token' in browser storage
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  return (
    // Step 3: Provide Token via Context
    <TokenContext.Provider value={token}>
      <div className="bg-gradient-to-r from-cyan-500 to-blue-500 w-full h-full">
  
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/" element={<Signup />} />
          </Routes>
        </Router>
        <div className="cloud"></div>
      </div>
    </TokenContext.Provider>
  );
}
