import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "../assets/logo.png";
import { clearAuthData, isAuthenticated } from "../utils/authUtils";
import axios from 'axios';
import { User, LogOut } from 'lucide-react'; // NEW: Import icons for dropdown

const DEFAULT_PROFILE_PIC_FALLBACK = logo;

export default function Navbar() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [userProfilePic, setUserProfilePic] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const profileMenuRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileMenuRef.current && !profileMenuRef.current.contains(event.target) &&
        dropdownRef.current && !dropdownRef.current.contains(event.target)
      ) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileMenuRef, dropdownRef]);

  useEffect(() => {
    if (isAuthenticated()) {
      const savedName = localStorage.getItem("name") || sessionStorage.getItem("name");
      if (savedName) {
        setUserName(savedName);
      }

      const fetchUserProfilePic = async () => {
        const email = localStorage.getItem("email") || sessionStorage.getItem("email");
        if (!email) return;
        try {
          const token = localStorage.getItem('token') || sessionStorage.getItem("token");
          // FIX: Changed absolute URL to relative path for Vercel deployment
          const res = await axios.get(`/api/user/profile?email=${email}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.data.success && res.data.user) {
            setUserName(res.data.user.name || "");
            if (res.data.user.profilePic) {
              // FIX: Ensure profilePic URL is also relative, Vercel routes /uploads/(.*)
              setUserProfilePic(`${res.data.user.profilePic}`);
            } else {
              setUserProfilePic(DEFAULT_PROFILE_PIC_FALLBACK);
            }
          } else {
            setUserProfilePic(DEFAULT_PROFILE_PIC_FALLBACK);
          }
        } catch (err) {
          console.error("Error fetching profile pic:", err);
          setUserProfilePic(DEFAULT_PROFILE_PIC_FALLBACK);
        }
      };
      fetchUserProfilePic();
    } else {
      setUserName("");
      setUserProfilePic(null);
      setShowProfileMenu(false);
    }
  }, [isAuthenticated, userName]);


  const handleSignOut = () => {
    clearAuthData();
    navigate('/login', { replace: true });
  };

  const toggleProfileMenu = () => {
    setShowProfileMenu(prev => !prev);
  };

  return (
    <nav className="relative flex justify-between items-center px-4 md:px-8 py-4 bg-green-200 border-b border-white/40 shadow-md">
      {/* App Logo and Title */}
      <div className="flex items-center">
        <Link to="/home" className="flex items-center">
          <img src={logo} alt="Logo" className="h-10 w-10 rounded-full mr-2" />
          <div className="flex flex-col justify-center">
            <h1 className="text-2xl md:text-3xl font-extrabold text-green-900 drop-shadow-sm leading-tight mb-0">
              CalorieApp
            </h1>
          </div>
        </Link>
      </div>
      
      {/* Conditionally render Profile Avatar & Dropdown Container */}
      {isAuthenticated() ? (
        <div className="flex items-center" ref={profileMenuRef}>
          <button
            onClick={toggleProfileMenu}
            className="w-10 h-10 rounded-full overflow-hidden border-2 border-green-500 hover:border-green-700 focus:outline-none focus:ring-2 focus:ring-green-600 transition-all duration-300"
            title="Open Profile Menu"
          >
            <img
              src={userProfilePic || DEFAULT_PROFILE_PIC_FALLBACK}
              alt="User Avatar"
              className="w-full h-full object-cover"
              onError={(e) => { e.target.onerror = null; e.target.src = DEFAULT_PROFILE_PIC_FALLBACK; }}
            />
          </button>

          {/* Profile Dropdown Menu */}
          {showProfileMenu && (
            <motion.div
              ref={dropdownRef}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute right-4 top-full mt-2
                       w-auto min-w-[180px] max-w-[250px]
                       bg-white rounded-lg shadow-xl py-2 z-50 border border-green-200
                       md:w-48 md:bg-white/80"
            >
              <div className="px-4 py-2 text-sm text-gray-700 border-b border-green-200">
                {userName ? `Hi, ${userName}` : 'Hello!'}
                {/* Removed email display */}
              </div>
              <Link
                to="/profile"
                onClick={() => setShowProfileMenu(false)}
                className="block px-4 py-2 text-green-700 hover:bg-green-100 transition-colors flex items-center space-x-2" // Added flex for icon alignment
              >
                <User size={16} /> {/* NEW: Profile Icon */}
                <span>Manage Profile</span>
              </Link>
              <button
                onClick={handleSignOut}
                className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-100 transition-colors border-t border-green-200 mt-2 pt-2 flex items-center space-x-2" // Added flex for icon alignment
              >
                <LogOut size={16} /> {/* NEW: Sign Out Icon */}
                <span>Sign Out</span>
              </button>
            </motion.div>
          )}
        </div>
      ) : (
        null
      )}
    </nav>
  );
}