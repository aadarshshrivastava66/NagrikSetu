import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import backendApi from "../api/backendApi";
import { useAuth } from "../context/AuthContext";

const DEPARTMENTS = ["Roads", "Water", "Electricity", "Sanitation", "Parks", "Safety", "Infrastructure"];
const CITIES = ["Indore", "Bhopal", "Pune", "Mumbai", "Bangalore"];

function EmployeeRegisterPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    city: "",
    ward: "",
    role: "gov", // gov | fieldworker
    department: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await backendApi.post("/auth/register", formData);
      setSuccess(true);
      setFormData({
        name: "", email: "", password: "", phone: "",
        city: "", ward: "", role: "gov", department: "",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  // Only admin can access this page
  if (user && user.role !== "admin") {
    navigate("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-xl mx-auto">

        <Link to="/gov/dashboard" className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-[#0f1923] mb-6">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"/>
            <polyline points="12 19 5 12 12 5"/>
          </svg>
          Back to Dashboard
        </Link>

        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          <h1 className="text-2xl font-extrabold text-[#0f1923] mb-1" style={{ fontFamily: "Sora, sans-serif" }}>
            Register New Employee
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            Create an account for a government officer or field worker
          </p>

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl mb-5">
              ✓ Employee registered successfully!
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Role selector */}
            <div>
              <label className="block text-sm font-semibold text-[#0f1923] mb-2">Employee Type *</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData((p) => ({ ...p, role: "gov" }))}
                  className={`py-3 rounded-xl border text-sm font-semibold transition-all
                    ${formData.role === "gov"
                      ? "border-[#1a56db] bg-blue-50 text-[#1a56db]"
                      : "border-gray-200 text-gray-500 hover:bg-gray-50"}`}
                >
                  🏛️ Department Officer
                </button>
                <button
                  type="button"
                  onClick={() => setFormData((p) => ({ ...p, role: "fieldworker" }))}
                  className={`py-3 rounded-xl border text-sm font-semibold transition-all
                    ${formData.role === "fieldworker"
                      ? "border-[#1a56db] bg-blue-50 text-[#1a56db]"
                      : "border-gray-200 text-gray-500 hover:bg-gray-50"}`}
                >
                  🧰 Field Worker
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#0f1923] mb-2">Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Employee's full name"
                required
                className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-[#1a56db]/20 focus:border-[#1a56db]"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#0f1923] mb-2">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="employee@gov.in"
                required
                className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-[#1a56db]/20 focus:border-[#1a56db]"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#0f1923] mb-2">Temporary Password *</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Min. 6 characters"
                required
                className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-[#1a56db]/20 focus:border-[#1a56db]"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#0f1923] mb-2">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-[#1a56db]/20 focus:border-[#1a56db]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#0f1923] mb-2">City *</label>
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-[#1a56db]/20 focus:border-[#1a56db]"
                >
                  <option value="">Select city</option>
                  {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#0f1923] mb-2">Department *</label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-[#1a56db]/20 focus:border-[#1a56db]"
                >
                  <option value="">Select department</option>
                  {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#0f1923] mb-2">Ward (optional)</label>
              <input
                type="text"
                name="ward"
                value={formData.ward}
                onChange={handleChange}
                placeholder="e.g. Ward 12"
                className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-[#1a56db]/20 focus:border-[#1a56db]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-[#1a56db] hover:bg-[#1140a8] text-white text-sm font-bold transition-all disabled:opacity-60"
            >
              {loading ? "Registering..." : "Register Employee"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EmployeeRegisterPage;