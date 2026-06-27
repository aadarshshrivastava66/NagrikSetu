import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import backendApi from "../api/backendApi";
import { useAuth } from "../context/AuthContext";

function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);
  
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await backendApi.post("/auth/login", formData);
      setUser(data.user);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0f1923] relative flex-col justify-between p-12 overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-blue-600/20 pointer-events-none" />
        <div className="absolute -bottom-24 -right-12 w-72 h-72 rounded-full bg-blue-800/20 pointer-events-none" />

        <Link to="/" className="flex items-center gap-2.5 relative z-10">
          <div className="w-9 h-9 rounded-xl bg-[#1a56db] flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
              <circle cx="12" cy="9" r="2.5"/>
            </svg>
          </div>
          <span className="font-bold text-lg text-white" style={{ fontFamily: "Sora, sans-serif" }}>
            Nagar<span className="text-blue-300">Seva</span>
          </span>
        </Link>

        <div className="relative z-10">
          <h2 className="text-3xl font-extrabold text-white leading-snug mb-4" style={{ fontFamily: "Sora, sans-serif" }}>
            Your city listens when you speak up.
          </h2>
          <p className="text-white/50 text-sm leading-relaxed max-w-xs">
            Track your reports, upvote issues, and hold your municipality accountable.
          </p>
        </div>

        <p className="text-xs text-white/25 relative z-10">© 2024 NagarSeva</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12">
        <div className="w-full max-w-md">

          <Link to="/" className="flex lg:hidden items-center gap-2 mb-10">
            <div className="w-8 h-8 rounded-lg bg-[#1a56db] flex items-center justify-center">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                <circle cx="12" cy="9" r="2.5"/>
              </svg>
            </div>
            <span className="font-bold text-base text-[#0f1923]" style={{ fontFamily: "Sora, sans-serif" }}>
              Nagar<span className="text-[#1a56db]">Seva</span>
            </span>
          </Link>

          <h1 className="text-2xl font-extrabold text-[#0f1923] mb-1" style={{ fontFamily: "Sora, sans-serif" }}>
            Welcome back
          </h1>
          <p className="text-sm text-gray-500 mb-8">
            Don't have an account?{" "}
            <Link to="/register" className="text-[#1a56db] font-semibold hover:underline">
              Create one free
            </Link>
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-[#0f1923] mb-1.5">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 bg-white outline-none transition-all focus:ring-2 focus:ring-[#1a56db]/20 focus:border-[#1a56db] hover:border-gray-300"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#0f1923] mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  className="w-full px-4 py-3 pr-11 text-sm rounded-xl border border-gray-200 bg-white outline-none transition-all focus:ring-2 focus:ring-[#1a56db]/20 focus:border-[#1a56db] hover:border-gray-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPass ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-[#1a56db] hover:bg-[#1140a8] text-white text-sm font-bold transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-1"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;