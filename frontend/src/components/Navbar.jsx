import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { token, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleBookingsClick = (e) => {
    if (!token) {
      e.preventDefault();
      alert(
        "🔒 Access Restricted! Please login first to manage or view your live bookings.",
      );
      navigate("/login");
    }
  };

  return (
    <nav className="bg-slate-100 border-b border-slate-200 px-4 sm:px-6 py-4 shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        {/* Logo Section */}
        <div
          className="font-extrabold text-xl text-blue-600 cursor-pointer flex items-center gap-1"
          onClick={() => navigate("/")}
        >
          Booking Hub <span className="text-amber-500">⚡</span>
        </div>

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          type="button"
          className="sm:hidden text-gray-700 hover:text-blue-600 focus:outline-none p-1.5 rounded-lg border border-gray-200 bg-white shadow-2xs"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        <div className="hidden sm:flex items-center gap-4 sm:gap-6">
          <Link
            to="/"
            className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-all"
          >
            Home
          </Link>

          <Link
            to="/bookings"
            onClick={handleBookingsClick}
            className="text-sm font-bold text-gray-700 hover:text-blue-600 flex items-center gap-1 bg-gray-50 hover:bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200 transition-all"
          >
            My Bookings 📂
          </Link>

          {!token ? (
            <button
              onClick={() => navigate("/login")}
              className="bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-blue-700 transition-all shadow-sm"
            >
              Login
            </button>
          ) : (
            <div className="flex items-center gap-4">
              <div className="flex flex-col text-right">
                <span className="text-xs font-extrabold text-gray-800 uppercase tracking-wider">
                  {user?.name || "Profile"}
                </span>
                <span
                  className={`text-[10px] font-black px-2 py-0.5 rounded mt-0.5 text-white text-center tracking-wide ${
                    user?.role === "Provider" ? "bg-amber-500" : "bg-purple-600"
                  }`}
                >
                  {user?.role === "Provider" ? "🛠️ Provider" : "👤 Customer"}
                </span>
              </div>

              {logout && (
                <button
                  onClick={logout}
                  className="text-xs font-bold text-red-500 hover:text-red-700 underline cursor-pointer"
                >
                  Logout
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {isMenuOpen && (
        <div className="sm:hidden mt-4 pt-4 border-t border-gray-200/60 flex flex-col gap-3 animate-fadeIn">
          <Link
            to="/"
            onClick={() => setIsMenuOpen(false)}
            className="text-sm font-semibold text-gray-700 hover:text-blue-600 py-1.5 px-2 rounded-lg hover:bg-gray-50 block"
          >
            Home
          </Link>

          <Link
            to="/bookings"
            onClick={(e) => {
              setIsMenuOpen(false);
              handleBookingsClick(e);
            }}
            className="text-sm font-bold text-gray-700 hover:text-blue-600 flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-2xs"
          >
            <span>My Bookings</span>
            <span>📂</span>
          </Link>

          {!token ? (
            <button
              onClick={() => {
                setIsMenuOpen(false);
                navigate("/login");
              }}
              className="w-full bg-blue-600 text-white text-xs font-bold py-2.5 rounded-lg hover:bg-blue-700 shadow-sm text-center"
            >
              Login
            </button>
          ) : (
            <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-2xs flex items-center justify-between gap-2">
              <div className="flex flex-col text-left">
                <span className="text-xs font-extrabold text-gray-800 uppercase tracking-wider">
                  {user?.name || "Profile"}
                </span>
                <span
                  className={`text-[9px] font-black px-1.5 py-0.5 rounded mt-0.5 text-white text-center tracking-wide w-fit ${
                    user?.role === "Provider" ? "bg-amber-500" : "bg-purple-600"
                  }`}
                >
                  {user?.role === "Provider" ? "🛠️ Provider" : "👤 Customer"}
                </span>
              </div>

              {logout && (
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    logout();
                  }}
                  className="text-xs font-bold text-red-500 hover:bg-red-50 border border-dashed border-red-200 px-3 py-1.5 rounded-lg"
                >
                  Logout
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
