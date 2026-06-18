import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        },
      );

      if (response.data) {
        login(response.data.user, response.data.token);
        navigate("/");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-73px)] bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-4xl w-full grid md:grid-cols-2">
        {/* Left Side: Brand Banner */}
        <div className="hidden md:flex flex-col justify-center bg-blue-600 text-white p-12">
          <h2 className="text-3xl font-bold mb-4">
            Professional Services, One Click Away!
          </h2>
          <p className="text-blue-100 text-sm leading-relaxed">
            Find the best rated Electricians, Plumbers, and Mechanics in your
            area. Book instantly and manage your requests seamlessly.
          </p>
          <div className="mt-8 text-2xl">⚡🛠️</div>
        </div>

        <div className="p-8 md:p-12 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Welcome Back
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            Please enter your credentials to access your account.
          </p>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 mb-4 rounded text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-gray-600 text-sm font-medium mb-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-gray-600 text-sm font-medium mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 transition-all"
                required
              />
            </div>

            <div className="text-right mt-1">
              <Link
                to="/forgot-password"
                className="text-[11px] font-bold text-blue-600 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-all shadow-md hover:shadow-lg disabled:bg-blue-400 mt-2"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <p className="text-sm text-gray-600 text-center mt-6">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-blue-600 font-semibold hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
