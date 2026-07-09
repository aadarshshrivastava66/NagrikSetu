import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function GovDashboardPage() {
  const { user, loading: authLoading, logout } = useAuth();
  const navigate = useNavigate();

  const isAdmin = user?.role === "admin";
  const isGov = user?.role === "gov";

  useEffect(() => {
    if (!authLoading) {
      if (!user) navigate("/login");
      else if (!isGov && !isAdmin) navigate("/");
    }
  }, [user, authLoading]);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#1a56db] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || (!isGov && !isAdmin)) return null;

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Top bar */}
      <div className="bg-[#0f1923] px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#1a56db] flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </div>
            <div>
              <h1 className="text-sm font-bold text-white">
                {isAdmin ? "Admin Dashboard" : "Department Dashboard"}
              </h1>
              <p className="text-xs text-white/40">
                {isAdmin ? "Manage all civic issues" : `${user.department} · ${user.city}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-white/60">
              {user.name}{" "}
              <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full ml-1 uppercase">
                {user.role}
              </span>
            </span>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-lg border border-white/20 text-white/80 text-xs font-semibold hover:bg-white/10 transition-all"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-16">

        {/* Welcome */}
        <div className="text-center mb-12">
          <h2 className="text-2xl font-extrabold text-[#0f1923] mb-2" style={{ fontFamily: "Sora, sans-serif" }}>
            Welcome back, {user.name.split(" ")[0]}
          </h2>
          <p className="text-sm text-gray-500">
            {isAdmin
              ? "Choose an action to manage the platform"
              : `Managing ${user.department} issues in ${user.city}`}
          </p>
        </div>

        {/* Cards */}
        <div className={`grid grid-cols-1 ${isAdmin ? "md:grid-cols-2" : "md:grid-cols-1 max-w-md mx-auto"} gap-6`}>

          {/* Card 1 — View Issues (visible to both gov and admin) */}
          <Link
            to="/gov/issue"
            className="group bg-white rounded-2xl border border-gray-200 p-8 hover:shadow-lg hover:border-[#1a56db] hover:-translate-y-0.5 transition-all"
          >
            <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-5 group-hover:bg-[#1a56db] transition-all">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#1a56db" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:stroke-white transition-all">
                <path d="M9 11l3 3L22 4"/>
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
              </svg>
            </div>
            <h3 className="text-lg font-bold text-[#0f1923] mb-2">
              View Reported Issues
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed mb-4">
              {isAdmin
                ? "Browse and manage every issue reported across all departments and cities."
                : `See all issues reported for ${user.department} in ${user.city}, and update their status.`}
            </p>
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1a56db]">
              Go to issues
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </span>
          </Link>

          {/* Card 2 — Employee Registration (admin only) */}
          {isAdmin && (
            <Link
              to="/employeeRegister"
              className="group bg-white rounded-2xl border border-gray-200 p-8 hover:shadow-lg hover:border-[#1a56db] hover:-translate-y-0.5 transition-all"
            >
              <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center mb-5 group-hover:bg-[#1a56db] transition-all">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#7e22ce" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:stroke-white transition-all">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="8.5" cy="7" r="4"/>
                  <line x1="20" y1="8" x2="20" y2="14"/>
                  <line x1="23" y1="11" x2="17" y2="11"/>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-[#0f1923] mb-2">
                Register New Employee
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-4">
                Add a new government employee account with department and city access assigned.
              </p>
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1a56db]">
                Register employee
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform">
                  <line x1="5" y1="12" x2="19" y2="12"/>
                  <polyline points="12 5 19 12 12 19"/>
                </svg>
              </span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default GovDashboardPage;