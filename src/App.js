import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Home from "./components/Home";
import Profile from "./components/Profile";
import LogFood from "./components/LogFood";
import CalorieInsights from "./components/CalorieInsights";
import Navbar from "./components/Navbar";
import SplashScreen from "./components/SplashScreen";
import { isAuthenticated } from "./utils/authUtils";

function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Show splash for at least 2.5 seconds
    const minimumDisplayTime = setTimeout(() => {
      setShowSplash(false);
    }, 2500);

    return () => clearTimeout(minimumDisplayTime);
  }, []);

  if (showSplash) {
    return <SplashScreen onAnimationComplete={() => setShowSplash(false)} />;
  }

  return (
    <Router>
      {/* ✅ Always show Navbar on all pages */}
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={isAuthenticated() ? <Navigate to="/home" /> : <Login />}
        />
        <Route
          path="/login"
          element={isAuthenticated() ? <Navigate to="/home" /> : <Login />}
        />
        <Route
          path="/signup"
          element={isAuthenticated() ? <Navigate to="/home" /> : <Signup />}
        />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/log-food" element={<LogFood />} />
        <Route path="/calorie-insights" element={<CalorieInsights />} />
      </Routes>
    </Router>
  );
}

export default App;
