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
import { isAuthenticated } from "./utils/authUtils"; // Import the utility

function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const minimumDisplayTime = setTimeout(() => {
      setShowSplash(false);
    }, 4000);

    return () => clearTimeout(minimumDisplayTime);
  }, []);

  if (showSplash) {
    return <SplashScreen onAnimationComplete={() => setShowSplash(false)} />;
  }

  return (
    <Router>
      {/* NEW: Conditionally render Navbar only if authenticated */}
      {isAuthenticated() && <Navbar />}
      
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
        {/* Home page needs to handle its content based on login status */}
        <Route path="/home" element={<Home />} />
        {/* Profile, LogFood, CalorieInsights should probably be protected routes.
            For simplicity, if isAuthenticated() is false and they try to access,
            they will see the Navbar gone and Home/Login button shown. */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/log-food" element={<LogFood />} />
        <Route path="/calorie-insights" element={<CalorieInsights />} />
      </Routes>
    </Router>
  );
}
export default App;