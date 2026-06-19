import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Home = () => {
  const { token, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState("");
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [bookingDate, setBookingDate] = useState("");
  const [expiryMinutes, setExpiryMinutes] = useState(30);
  const [bookingMessage, setBookingMessage] = useState("");

  const categories = [
    "Electrician",
    "Plumber",
    "Painter",
    "Cleaner",
    "Mechanic",
    "Furniture",
    "AC Repair",
  ];

  useEffect(() => {
    if (selectedCategory) {
      fetchProviders();
    }
  }, [selectedCategory]);

  const fetchProviders = async () => {
    setLoading(true);
    try {
      const userCity = user?.city || "";
      const userState = user?.state || "";

      const response = await axios.get(
        `https://booking-hub-backend-plga.onrender.com/api/bookings/public-providers?category=${selectedCategory}&city=${userCity}&state=${userState}`,
      );
      if (response.data?.success) {
        setProviders(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching providers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBooking = async (e) => {
    e.preventDefault();
    if (!bookingDate) {
      alert("Please select a date and time!");
      return;
    }

    if (providers.length === 0) {
      alert(
        `Sorry! Currently, no active experts are available in ${user?.city || "your area"}. You cannot broadcast a request right now.`,
      );
      setIsModalOpen(false);
      return;
    }

    try {
      const response = await axios.post(
        "https://booking-hub-backend-plga.onrender.com/api/bookings/book",
        {
          category: selectedCategory,
          bookingDate,
          expiryMinutes,
          visitingCharge: 100,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (response.data?.success) {
        setBookingMessage("🎉 Broadcast Successful! Request added to pool.");
        setTimeout(() => {
          setIsModalOpen(false);
          setBookingMessage("");
          setBookingDate("");
          navigate("/bookings");
        }, 2000);
      }
    } catch (error) {
      alert(error.response?.data?.message || "Broadcast Failed!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto text-center py-6 sm:py-8">
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
          Smart Booking Hub ⚡
        </h1>
        <p className="text-xs text-gray-500 mt-1.5 font-medium px-2">
          Select a professional domain to view online experts or broadcast a
          custom job requirement instantly.
        </p>
        {user?.city && (
          <p className="text-[11px] text-blue-600 font-bold mt-1 uppercase tracking-wider">
            📍 Current Zone: {user.city}, {user.state}
          </p>
        )}
      </div>

      {/* Category Buttons Grid Fix */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`p-2.5 rounded-xl font-bold text-center text-xs transition-all border ${
                selectedCategory === cat
                  ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                  : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        {selectedCategory ? (
          <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-xs">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-gray-50">
              <div>
                <h2 className="text-sm font-black text-gray-800 uppercase tracking-wider">
                  Active Experts Pool:{" "}
                  <span className="text-blue-600">{selectedCategory}</span>
                </h2>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Available professionals in {user?.city || "your area"}
                </p>
              </div>

              {user?.role !== "Provider" && (
                <button
                  onClick={() => {
                    if (providers.length === 0) {
                      alert(
                        `❌ Broadcast Blocked: Is time ${user?.city || "Jodhpur"} me koi bhi ${selectedCategory} available nahi hai.`,
                      );
                    } else {
                      setIsModalOpen(true);
                    }
                  }}
                  className={`w-full sm:w-auto font-bold text-xs px-3.5 py-2 rounded-xl shadow-xs transition-all text-center ${
                    providers.length === 0
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-gray-900 hover:bg-gray-800 text-white"
                  }`}
                >
                  Broadcast New Request ✉
                </button>
              )}
            </div>

            {loading ? (
              <div className="text-center py-8 text-xs font-bold text-gray-400 animate-pulse">
                Scanning verified providers in your city...
              </div>
            ) : providers.length === 0 ? (
              <div className="text-center py-8 text-xs text-red-500 font-bold bg-red-50/50 rounded-xl p-4 border border-dashed border-red-200">
                ⚠️ No active providers registered in {user?.city || "your city"}{" "}
                under this category. Broadcast service is temporarily
                unavailable for this domain to avoid infinite queue waiting.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {providers.map((p) => (
                  <div
                    key={p._id}
                    className="p-4 border border-gray-100 rounded-xl bg-gray-50/50 flex justify-between items-center gap-2"
                  >
                    <div className="space-y-1.5">
                      <h3 className="font-black text-sm text-gray-800 uppercase">
                        {p.name}
                      </h3>

                      {/* FIXED: Expert Charges and Experience UI blocks added perfectly */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[11px] font-black text-green-600 bg-green-50/80 px-2 py-0.5 rounded-md border border-green-100">
                          ₹{p.pricePerHour || 0}/hr
                        </span>
                        <span className="text-[10px] font-bold text-gray-600 bg-gray-200/60 px-2 py-0.5 rounded-md">
                          {p.experience || 0} Yrs Exp
                        </span>
                      </div>

                      <div className="flex flex-col gap-0.5 mt-1">
                        <p className="text-[10px] font-bold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded-sm inline-block w-fit">
                          {p.averageRating && p.averageRating > 0
                            ? `⭐ ${p.averageRating.toFixed(1)} Rating`
                            : "⭐ New Expert"}
                        </p>
                        <p className="text-[9px] font-semibold text-gray-500 italic ml-0.5">
                          💼 Done:{" "}
                          {p.successBookingsCount ||
                            p.completedServices ||
                            p.jobsDone ||
                            0}{" "}
                          jobs
                        </p>
                        <p className="text-[9px] font-bold text-gray-400">
                          📍 Locality: {p.city || "Sri Ganganagar"}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md shrink-0">
                      Online 🟢
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-2xl text-xs text-gray-400 font-bold bg-white px-4">
            Please pick a domain service category from the deck above to
            initialize terminal panels.
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white p-6 rounded-2xl shadow-xl max-w-md w-full border border-gray-100 relative">
            <h3 className="font-black text-base text-gray-800 mb-1">
              Broadcast Request:{" "}
              <span className="text-blue-600">{selectedCategory}</span>
            </h3>
            <p className="text-[11px] text-gray-400 mb-4">
              This broadcast will auto-expire in specified minutes if not
              grabbed.
            </p>

            {bookingMessage && (
              <div className="mb-3 p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl font-bold text-xs text-center">
                {bookingMessage}
              </div>
            )}

            <form onSubmit={handleCreateBooking} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-600 mb-1">
                  Preferred Date & Time 📅
                </label>
                <input
                  type="datetime-local"
                  required
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full p-2.5 border border-gray-200 rounded-xl text-xs font-medium focus:outline-blue-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-600 mb-1">
                  Broadcast Expiry (Minutes) ⏳
                </label>
                <select
                  value={expiryMinutes}
                  onChange={(e) => setExpiryMinutes(Number(e.target.value))}
                  className="w-full p-2.5 border border-gray-200 rounded-xl text-xs font-bold focus:outline-blue-500"
                >
                  <option value="15">15 Minutes Fast Pool</option>
                  <option value="30">30 Minutes Standard Pool</option>
                  <option value="60">60 Minutes Extended Pool</option>
                </select>
              </div>

              <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-xl flex items-center justify-between gap-2">
                <div>
                  <h4 className="text-xs font-bold text-blue-900">
                    Standard Visiting Allowance 💰
                  </h4>
                  <p className="text-[10px] text-blue-700/80 mt-0.5">
                    Fixed allowance for provider's basic travel/time investment.
                  </p>
                </div>
                <span className="text-sm font-black text-blue-700 bg-white px-2.5 py-1 rounded-lg border border-blue-200 shadow-2xs shrink-0">
                  ₹100
                </span>
              </div>

              <div className="flex justify-end gap-2 text-xs font-bold pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl transition-all"
                >
                  Dismiss
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs transition-all"
                >
                  Transmit Broadcast ⚡
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
