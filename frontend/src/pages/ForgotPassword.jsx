import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const response = await axios.post(
        "https://booking-hub-backend-plga.onrender.com//api/auth/forgot-password",
        { email },
      );
      if (response.data?.success) {
        setMessage("🎉 OTP sent successfully to your email!");
        setStep(2);
      }
    } catch (error) {
      alert(
        error.response?.data?.message || "Failed to send OTP. Check email!",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const response = await axios.post(
        "https://booking-hub-backend-plga.onrender.com//api/auth/reset-password",
        {
          email,
          otp,
          newPassword,
        },
      );
      if (response.data?.success) {
        alert("🔒 Password changed successfully! Redirecting to login...");
        navigate("/login");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Invalid OTP or Reset Failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-2xl shadow-xl max-w-md w-full border border-gray-100">
        <h2 className="text-2xl font-black text-gray-900 tracking-tight text-center mb-1">
          Account Recovery ⚡
        </h2>
        <p className="text-xs text-gray-400 text-center mb-6">
          {step === 1
            ? "Enter your registered email to receive a 4-digit verification OTP."
            : "Enter the OTP sent to your Gmail and set a new password."}
        </p>

        {message && (
          <div className="mb-4 p-2.5 bg-green-50 border border-green-200 text-green-800 rounded-xl font-bold text-xs text-center animate-pulse">
            {message}
          </div>
        )}

        {step === 1 && (
          <form onSubmit={handleSendOTP} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-gray-600 mb-1 uppercase tracking-wider">
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="alex@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-xl text-xs font-medium focus:outline-blue-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all uppercase tracking-wider"
            >
              {loading ? "Sending Security OTP..." : "Send Verification Code ✉"}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-gray-600 mb-1 uppercase tracking-wider">
                Enter 4-Digit OTP
              </label>
              <input
                type="text"
                required
                maxLength="4"
                placeholder="1234"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-xl text-center text-sm font-bold tracking-widest focus:outline-blue-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-600 mb-1 uppercase tracking-wider">
                New Strong Password
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-xl text-xs font-medium focus:outline-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gray-900 hover:bg-gray-800 text-white font-bold text-xs rounded-xl shadow-md transition-all uppercase tracking-wider"
            >
              {loading ? "Updating Account..." : "Confirm & Reset Password 🔒"}
            </button>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full text-center text-[11px] text-blue-600 font-bold hover:underline block pt-2"
            >
              Resend OTP / Change Email
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
