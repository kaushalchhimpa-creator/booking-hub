import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    contactNumber: "",
    state: "",
    city: "",
    role: "User",
    category: "",
    experience: "",
    pricePerHour: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const submissionData = { ...formData };
    if (formData.role === "User") {
      delete submissionData.category;
      delete submissionData.experience;
      delete submissionData.pricePerHour;
    }

    try {
      const response = await axios.post(
        "https://booking-hub-backend-plga.onrender.com/api/auth/register",
        submissionData,
      );
      if (response.data.success) {
        alert("🎉 Registration successful! Please log in.");
        navigate("/login");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-black text-gray-800 text-center mb-1">
          Create Account
        </h2>
        <p className="text-xs text-gray-400 text-center mb-6">
          Join the live request system pool
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              className="w-full px-3 py-2 border text-xs rounded-xl focus:outline-blue-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">
              Email Address
            </label>
            <input
              type="type"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              className="w-full px-3 py-2 border text-xs rounded-xl focus:outline-blue-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-3 py-2 border text-xs rounded-xl focus:outline-blue-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">
              Contact Number
            </label>
            <input
              type="text"
              name="contactNumber"
              required
              value={formData.contactNumber}
              onChange={handleChange}
              placeholder="9876543210"
              className="w-full px-3 py-2 border text-xs rounded-xl focus:outline-blue-500"
            />
          </div>

          {/* 🛠️ FIXED: State and City fields added in layout */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">
                State
              </label>
              <input
                type="text"
                name="state"
                required
                value={formData.state}
                onChange={handleChange}
                placeholder="Rajasthan"
                className="w-full px-3 py-2 border text-xs rounded-xl focus:outline-blue-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">
                City
              </label>
              <input
                type="text"
                name="city"
                required
                value={formData.city}
                onChange={handleChange}
                placeholder="Sri Ganganagar"
                className="w-full px-3 py-2 border text-xs rounded-xl focus:outline-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">
              Select Profile Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-3 py-2 border text-xs rounded-xl bg-white font-bold focus:outline-blue-500"
            >
              <option value="User">Standard Client (Request Services)</option>
              <option value="Provider">
                Service Expert (Grab & Earn Jobs)
              </option>
            </select>
          </div>

          {formData.role === "Provider" && (
            <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100/50 space-y-3 animate-fadeIn">
              <div>
                <label className="block text-[11px] font-bold text-blue-600 uppercase mb-1">
                  Expert Category
                </label>
                <select
                  name="category"
                  required={formData.role === "Provider"}
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border text-xs rounded-xl bg-white font-semibold focus:outline-blue-500"
                >
                  <option value="">-- Choose Category --</option>
                  <option value="Electrician">Electrician</option>
                  <option value="Plumber">Plumber</option>
                  <option value="Cleaner">Cleaner</option>
                  <option value="Carpenter">Carpenter</option>
                  <option value="Furniture">Furniture</option>
                  <option value="Painter">Painter</option>
                  <option value="Mechanic">Mechanic</option>
                  <option value="AC Repair">AC Repair</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-blue-600 uppercase mb-1">
                    Experience (Yrs)
                  </label>
                  <input
                    type="number"
                    name="experience"
                    required={formData.role === "Provider"}
                    value={formData.experience}
                    onChange={handleChange}
                    placeholder="2"
                    min="0"
                    className="w-full px-3 py-2 border text-xs rounded-xl focus:outline-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-blue-600 uppercase mb-1">
                    Rate (₹ / hr)
                  </label>
                  <input
                    type="number"
                    name="pricePerHour"
                    required={formData.role === "Provider"}
                    value={formData.pricePerHour}
                    onChange={handleChange}
                    placeholder="250"
                    min="0"
                    className="w-full px-3 py-2 border text-xs rounded-xl focus:outline-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2.5 rounded-xl font-bold text-xs shadow-xs hover:bg-blue-700 transition-colors disabled:bg-gray-300"
          >
            {loading ? "Registering Account..." : "Create Account 🚀"}
          </button>
        </form>

        <p className="text-center text-xs text-gray-500 pt-2">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 font-bold hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
