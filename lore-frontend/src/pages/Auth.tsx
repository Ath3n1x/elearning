import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/apiClient";

const Auth: React.FC = () => {
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await api.post("/auth/login", loginData);
      localStorage.setItem("token", res.data.access_token);
      // Fetch user profile to check completeness
      const userRes = await api.get("/api/user/me");
      const { name, age, grade } = userRes.data || {};
      if (name && age && grade) {
        navigate("/dashboard");
      } else {
        navigate("/profile");
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (signupData.password !== signupData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!signupData.name.trim()) {
      setError("Name is required");
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("/auth/register", {
        username: signupData.name,
        email: signupData.email,
        password: signupData.password,
      });
      localStorage.setItem("token", res.data.access_token);
      navigate("/profile");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-purple-100 px-4 py-8">
      <div className="relative bg-white rounded-2xl shadow-2xl p-4 w-full max-w-sm border border-purple-100 backdrop-blur-sm overflow-y-auto max-h-[90vh]">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex gap-1">
            <div className="w-3 h-3 bg-purple-600 rounded-sm" />
            <div className="w-3 h-3 bg-purple-400 rounded-sm" />
            <div className="w-3 h-3 bg-purple-600 rounded-sm" />
            <div className="w-3 h-3 bg-purple-400 rounded-sm" />
          </div>
          <span className="text-lg font-semibold text-gray-900">Lore</span>
        </div>

        <div className="mb-4">
          <h1 className="text-xl font-bold text-gray-900 mb-1">
            {tab === "login" ? "Welcome back" : "Create account"}
          </h1>
          <p className="text-gray-600 text-xs">
            {tab === "login"
              ? "Please enter your details"
              : "Please fill in your information"}
          </p>
        </div>

        {error && (
          <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-xs">{error}</p>
          </div>
        )}

        {/* Loading Skeleton */}
        {loading ? (
          <div className="space-y-3 animate-pulse">
            {[...Array(tab === "login" ? 2 : 4)].map((_, i) => (
              <div key={i} className="h-9 bg-purple-100 rounded-md" />
            ))}
            <div className="h-10 bg-purple-200 rounded-md" />
          </div>
        ) : tab === "login" ? (
          <form onSubmit={handleLogin} className="space-y-3">
            <InputField
              label="Email address"
              type="email"
              value={loginData.email}
              onChange={(e) =>
                setLoginData({ ...loginData, email: e.target.value })
              }
              required
            />
            <InputField
              label="Password"
              type="password"
              value={loginData.password}
              onChange={(e) =>
                setLoginData({ ...loginData, password: e.target.value })
              }
              required
            />
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3 h-3 text-purple-600 border-gray-300 rounded"
                />
                <span className="text-gray-700">Remember for 30 days</span>
              </label>
              <button type="button" className="text-purple-600 font-medium">
                Forgot password
              </button>
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2.5 px-4 rounded-lg font-semibold shadow-md transition-colors ${
                loading
                  ? "bg-purple-100 text-purple-500 cursor-not-allowed"
                  : "bg-purple-600 hover:bg-purple-700 text-white"
              }`}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignup} className="space-y-4">
            <InputField
              label="Full name"
              type="text"
              value={signupData.name}
              onChange={(e) =>
                setSignupData({ ...signupData, name: e.target.value })
              }
              required
            />
            <InputField
              label="Email address"
              type="email"
              value={signupData.email}
              onChange={(e) =>
                setSignupData({ ...signupData, email: e.target.value })
              }
              required
            />
            <InputField
              label="Password"
              type="password"
              value={signupData.password}
              onChange={(e) =>
                setSignupData({ ...signupData, password: e.target.value })
              }
              required
            />
            <InputField
              label="Confirm password"
              type="password"
              value={signupData.confirmPassword}
              onChange={(e) =>
                setSignupData({
                  ...signupData,
                  confirmPassword: e.target.value,
                })
              }
              required
            />
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2.5 px-4 rounded-lg font-semibold shadow-md transition-colors ${
                loading
                  ? "bg-purple-100 text-purple-500 cursor-not-allowed"
                  : "bg-purple-600 hover:bg-purple-700 text-white"
              }`}
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>
        )}

        {/* Google Auth */}
        <div className="mt-3">
          <button
            type="button"
            className="w-full flex items-center justify-center gap-2 py-1.5 px-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 text-sm"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span className="text-gray-700 font-medium">
              Sign in with Google
            </span>
          </button>
        </div>

        <div className="mt-2 text-center">
          <p className="text-gray-600 text-xs">
            {tab === "login"
              ? "Don't have an account? "
              : "Already have an account? "}
            <button
              type="button"
              onClick={() => setTab(tab === "login" ? "signup" : "login")}
              className="text-purple-600 font-medium"
            >
              {tab === "login" ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

const InputField = ({
  label,
  type,
  value,
  onChange,
  required = false,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}) => (
  <div>
    <label className="block text-xs font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors text-sm"
    />
  </div>
);

export default Auth;
