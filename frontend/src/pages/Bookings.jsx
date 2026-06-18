import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRateModal, setShowRateModal] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [ratingValue, setRatingValue] = useState(5);
  const [reviewText, setReviewText] = useState("");

  const { token, user } = useContext(AuthContext);

  useEffect(() => {
    fetchBookings(true);

    const intervalId = setInterval(() => {
      fetchBookings(false);
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const fetchBookings = async (showLoader) => {
    if (showLoader) setLoading(true);
    try {
      const response = await axios.get(
        "https://booking-hub-backend-plga.onrender.com/api/bookings/my-bookings",
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (response.data?.success) {
        setBookings(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching console pool:", error);
    } finally {
      if (showLoader) setLoading(false);
    }
  };

  const handleGrabJob = async (bookingId) => {
    try {
      const response = await axios.put(
        "https://booking-hub-backend-plga.onrender.com/api/bookings/status",
        { bookingId, status: "Accepted", providerEta: "30 Mins" },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (response.data?.success) {
        alert("⚡ Job grabbed successfully!");
        fetchBookings(false);
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to grab job");
    }
  };

  const handleSatisfy = async (bookingId) => {
    try {
      const response = await axios.put(
        "https://booking-hub-backend-plga.onrender.com/api/bookings/satisfy",
        { bookingId },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (response.data?.success) {
        alert("✔ Order marked as Satisfied!");
        fetchBookings(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleFinalComplete = async (bookingId) => {
    try {
      const response = await axios.put(
        "https://booking-hub-backend-plga.onrender.com/api/bookings/final-complete",
        { bookingId },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (response.data?.success) {
        alert("💰 Service Completed Successfully!");
        fetchBookings(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleRatingSubmit = async () => {
    try {
      const response = await axios.put(
        "https://booking-hub-backend-plga.onrender.com/api/bookings/rate",
        {
          bookingId: selectedBookingId,
          rating: ratingValue,
          review: reviewText,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (response.data?.success) {
        alert("🎉 Review submitted successfully!");
        setShowRateModal(false);
        setReviewText("");
        fetchBookings(false);
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to submit review");
    }
  };

  if (loading)
    return (
      <div className="p-8 text-center text-xs font-bold text-gray-500">
        Syncing with Live Action Pool...
      </div>
    );

  const isRequester = (b) => {
    if (!b.user || !user) return false;
    const bUserId = typeof b.user === "object" ? b.user._id : b.user;
    const loggedInId = user._id || user.id;
    return bUserId?.toString() === loggedInId?.toString();
  };

  const isAssignedProvider = (b) => {
    if (!b.provider || !user) return false;
    const bProviderId =
      typeof b.provider === "object" ? b.provider._id : b.provider;
    const loggedInId = user._id || user.id;
    return bProviderId?.toString() === loggedInId?.toString();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-black text-gray-800 flex items-center gap-2">
            Live Request Action Console{" "}
            <span className="w-2 h-2 rounded-full bg-green-500 animate-ping"></span>
          </h2>
          <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-1 rounded font-semibold">
            🔄 Auto-Sync On (5s)
          </span>
        </div>

        {bookings.length === 0 ? (
          <div className="text-center py-12 text-xs border border-dashed rounded-xl text-gray-400 font-medium">
            No active broadcasts available in the live pool.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 font-bold border-b border-gray-100">
                  <th className="p-3">Client / Expert Name</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Mutual Contact Info</th>
                  <th className="p-3">Live Timeline / ETA</th>
                  <th className="p-3">State</th>
                  <th className="p-3 text-right">Action Portal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {bookings.map((b) => (
                  <tr
                    key={b._id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="p-3 font-medium text-gray-800">
                      <div>
                        <span className="font-bold block">
                          👤 Client: {b.user?.name || "User"}
                        </span>
                        {b.provider && (
                          <span className="text-[11px] text-blue-600 font-semibold block mt-1">
                            ⚡ Expert: {b.provider?.name || "Assigned"}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="p-3">
                      <span className="bg-blue-50 text-blue-600 px-2.5 py-1 rounded-md font-bold text-[10px]">
                        {b.category}
                      </span>
                    </td>

                    <td className="p-3">
                      {b.status === "Pending" ? (
                        <span className="bg-amber-50 text-amber-700 px-2 py-1 rounded border border-amber-200 font-medium text-[11px]">
                          🔒 Hidden until Grabbed
                        </span>
                      ) : (
                        <span className="bg-green-50 text-green-700 px-2 py-1 rounded font-bold text-[11px]">
                          👤 Contact:{" "}
                          {isRequester(b)
                            ? b.provider?.contactNumber || "9876543210"
                            : b.user?.contactNumber || "1234567890"}
                        </span>
                      )}
                    </td>

                    <td className="p-3 font-medium text-gray-500">
                      {b.status === "Pending"
                        ? "Limit: 30 mins"
                        : `ETA: ${b.providerEta || "30 Mins"}`}
                    </td>

                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded font-black text-[10px] tracking-wide uppercase ${
                          b.status === "Pending"
                            ? "text-amber-600 bg-amber-50"
                            : b.status === "Accepted"
                              ? "text-blue-600 bg-blue-50"
                              : b.status === "Satisfied"
                                ? "text-indigo-600 bg-indigo-50"
                                : "text-green-600 bg-green-50"
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>

                    <td className="p-3 text-right space-x-1">
                      {user?.role === "Provider" &&
                        b.status === "Pending" &&
                        (isRequester(b) ? (
                          <span className="text-[10px] text-gray-400 italic">
                            Self Post
                          </span>
                        ) : (
                          <button
                            onClick={() => handleGrabJob(b._id)}
                            className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1 rounded-md font-bold text-[10px] shadow-xs"
                          >
                            Grab Job ⚡
                          </button>
                        ))}

                      {isRequester(b) && b.status === "Accepted" && (
                        <button
                          onClick={() => handleSatisfy(b._id)}
                          className="bg-blue-600 text-white px-3 py-1 rounded-md font-bold text-[10px]"
                        >
                          Mark Satisfied ✔
                        </button>
                      )}

                      {isAssignedProvider(b) && b.status === "Satisfied" && (
                        <button
                          onClick={() => handleFinalComplete(b._id)}
                          className="bg-green-600 text-white px-3 py-1 rounded-md font-bold text-[10px]"
                        >
                          Final Complete 💰
                        </button>
                      )}

                      {b.status === "Completed" &&
                        isRequester(b) &&
                        !b.rating && (
                          <button
                            onClick={() => {
                              setSelectedBookingId(b._id);
                              setShowRateModal(true);
                            }}
                            className="bg-yellow-500 text-white px-2 py-1 rounded-md font-bold text-[10px]"
                          >
                            Rate Expert ⭐
                          </button>
                        )}

                      {b.status === "Completed" &&
                        (b.rating || !isRequester(b)) && (
                          <div className="text-right">
                            <span className="text-gray-400 font-bold text-[10px] block">
                              Job Done 🎉
                            </span>
                            {b.rating && (
                              <span className="text-amber-500 font-black text-[10px] block mt-0.5">
                                Given: ⭐ {b.rating}
                              </span>
                            )}
                          </div>
                        )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showRateModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white p-5 rounded-2xl shadow-xl max-w-sm w-full border">
            <h3 className="font-black text-sm mb-3 text-gray-800">
              Rate Service Experience ⭐
            </h3>
            <div className="mb-3">
              <select
                value={ratingValue}
                onChange={(e) => setRatingValue(Number(e.target.value))}
                className="w-full p-2 border text-xs rounded-lg font-bold"
              >
                <option value="5">⭐⭐⭐⭐⭐ 5 - Excellent</option>
                <option value="4">⭐⭐⭐⭐ 4 - Good</option>
                <option value="3">⭐⭐⭐ 3 - Average</option>
                <option value="2">⭐⭐ 2 - Poor</option>
                <option value="1">⭐ 1 - Horrible</option>
              </select>
            </div>
            <div className="mb-4">
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share your experience..."
                className="w-full p-2 border text-xs rounded-lg h-16 resize-none"
              ></textarea>
            </div>
            <div className="flex justify-end gap-2 text-xs font-bold">
              <button
                onClick={() => setShowRateModal(false)}
                className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleRatingSubmit}
                className="px-3 py-1.5 bg-blue-600 text-white rounded-lg"
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookings;
