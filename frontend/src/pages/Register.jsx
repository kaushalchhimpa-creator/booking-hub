import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const locationData = {
  Rajasthan: [
    "Sri Ganganagar",
    "Jaipur",
    "Jodhpur",
    "Udaipur",
    "Bikaner",
    "Kota",
  ],
  Punjab: ["Amritsar", "Ludhiana", "Jalandhar", "Patiala", "Bathinda"],
  Haryana: ["Gurugram", "Faridabad", "Hisar", "Ambala", "Panipat"],
  Delhi: [
    "New Delhi",
    "North Delhi",
    "South Delhi",
    "West Delhi",
    "East Delhi",
  ],
};

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [role, setRole] = useState("");

  const [category, setCategory] = useState("Electrician");
  const [experience, setExperience] = useState("");
  const [pricePerHour, setPricePerHour] = useState("");
  const [contactNumber, setContactNumber] = useState("");

  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!role) {
      setError(
        "❌ Please select a profile role: Customer or Service Provider!",
      );
      return;
    }
    if (!selectedState || !selectedCity) {
      setError("❌ Please select both State and City locations!");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name,
        email,
        password,
        role,
        state: selectedState,
        city: selectedCity,
      };

      if (role === "Provider") {
        Object.assign(payload, {
          category,
          experience: Number(experience),
          pricePerHour: Number(pricePerHour),
          contactNumber,
        });
      }

      const response = await axios.post(
        "https://booking-hub-backend-plga.onrender.com//api/auth/register",
        payload,
      );
      if (response.data) {
        setSuccess("🎉 Account created successfully! Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Registration failed. Please check network or try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 md:p-8">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-4xl w-full grid md:grid-cols-2">
        {/* Left Side Banner */}
        <div className="hidden md:flex flex-col justify-center bg-blue-600 text-white p-12">
          <h2 className="text-3xl font-bold mb-4">Market Ready Platform!</h2>
          <p className="text-blue-100 text-sm">
            Register either as a customer to book services or as a professional
            provider to earn instantly.
          </p>
        </div>

        <div className="p-6 md:p-10 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Create Account
          </h2>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-2 mb-4 text-xs font-semibold rounded">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-2 mb-4 text-xs font-semibold rounded">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-amber-700 text-xs font-bold mb-1">
                Join As (Select Carefully) *
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-lg border-2 border-amber-400 bg-amber-50 focus:ring-2 focus:ring-blue-500 text-sm font-bold text-gray-800"
              >
                <option value="">-- Choose Account Type --</option>
                <option value="Customer">Customer (Need a Service)</option>
                <option value="Provider">
                  Service Provider (Want to Work)
                </option>
              </select>
            </div>

            <div>
              <label className="block text-gray-600 text-xs font-medium mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-gray-600 text-xs font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-gray-600 text-xs font-medium mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-gray-600 text-xs font-medium mb-1">
                  State *
                </label>
                <select
                  value={selectedState}
                  onChange={(e) => {
                    setSelectedState(e.target.value);
                    setSelectedCity("");
                  }}
                  required
                  className="w-full px-3 py-2 rounded-lg border text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                >
                  <option value="">Select State</option>
                  {Object.keys(locationData).map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-600 text-xs font-medium mb-1">
                  City *
                </label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  required
                  disabled={!selectedState}
                  className="w-full px-3 py-2 rounded-lg border text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white disabled:bg-gray-100"
                >
                  <option value="">Select City</option>
                  {selectedState &&
                    locationData[selectedState].map((ct) => (
                      <option key={ct} value={ct}>
                        {ct}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {role === "Provider" && (
              <div className="space-y-3 border-t border-gray-100 pt-3">
                <div>
                  <label className="block text-gray-600 text-xs font-medium mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  >
                    <option value="Electrician">Electrician</option>
                    <option value="Plumber">Plumber</option>
                    <option value="Painter">Painter</option>
                    <option value="Cleaner">Cleaner</option>
                    <option value="Mechanic">Mechanic</option>
                    <option value="Furniture">Furniture</option>
                    <option value="AC Repair">AC Repair</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-600 text-xs font-medium mb-1">
                    Experience (Years)
                  </label>
                  <input
                    type="number"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-600 text-xs font-medium mb-1">
                    Price Per Hour (₹)
                  </label>
                  <input
                    type="number"
                    value={pricePerHour}
                    onChange={(e) => setPricePerHour(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-600 text-xs font-medium mb-1">
                    Contact Number
                  </label>
                  <input
                    type="text"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 text-sm mt-4 shadow transition-all"
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          <p className="text-xs text-gray-600 text-center mt-4">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 font-semibold hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
