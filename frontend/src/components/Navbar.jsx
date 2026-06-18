import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { token, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

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
    <nav className="bg-slate-100 border-b border-slate-200 px-6 py-4 flex justify-between items-center shadow-sm sticky top-0 z-50">
      <div
        className="font-extrabold text-xl text-blue-600 cursor-pointer flex items-center gap-1"
        onClick={() => navigate("/")}
      >
        Booking Hub <span className="text-amber-500">⚡</span>
      </div>

      <div className="flex items-center gap-6">
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
    </nav>
  );
};

export default Navbar;
