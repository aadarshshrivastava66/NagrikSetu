import { useState } from "react";
import backendApi from "../api/backendApi"
import { Link, useNavigate } from "react-router-dom";


const CITIES = ["Bhopal", "Indore", "Pune", "Mumbai", "Bangalore", "Hyderabad", "Surat", "Chandigarh"];

function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    city: "",
    ward: "",
    role: "admin",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await backendApi.post("/auth/register", formData);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
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
            Be the change your city needs.
          </h2>
          <p className="text-white/50 text-sm leading-relaxed max-w-xs">
            Create your free account and start reporting civic issues in under 60 seconds.
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
            Create your account
          </h1>
          <p className="text-sm text-gray-500 mb-8">
            Already have an account?{" "}
            <Link to="/login" className="text-[#1a56db] font-semibold hover:underline">
              Sign in
            </Link>
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-[#0f1923] mb-1.5">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Rahul Verma"
                required
                className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 bg-white outline-none transition-all focus:ring-2 focus:ring-[#1a56db]/20 focus:border-[#1a56db]"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#0f1923] mb-1.5">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 bg-white outline-none transition-all focus:ring-2 focus:ring-[#1a56db]/20 focus:border-[#1a56db]"
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
                  placeholder="Min. 6 characters"
                  required
                  className="w-full px-4 py-3 pr-11 text-sm rounded-xl border border-gray-200 bg-white outline-none transition-all focus:ring-2 focus:ring-[#1a56db]/20 focus:border-[#1a56db]"
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

            <div>
              <label className="block text-sm font-semibold text-[#0f1923] mb-1.5">Phone (optional)</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 bg-white outline-none transition-all focus:ring-2 focus:ring-[#1a56db]/20 focus:border-[#1a56db]"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#0f1923] mb-1.5">City</label>
              <select
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 bg-white outline-none transition-all focus:ring-2 focus:ring-[#1a56db]/20 focus:border-[#1a56db]"
              >
                <option value="">Select your city</option>
                {CITIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#0f1923] mb-1.5">Ward / Area</label>
              <input
                type="text"
                name="ward"
                value={formData.ward}
                onChange={handleChange}
                placeholder="e.g. Ward 12 or Vijay Nagar"
                required
                className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 bg-white outline-none transition-all focus:ring-2 focus:ring-[#1a56db]/20 focus:border-[#1a56db]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-[#1a56db] hover:bg-[#1140a8] text-white text-sm font-bold transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>

            <p className="text-xs text-gray-400 text-center">
              By creating an account you agree to our Terms and Privacy Policy.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;