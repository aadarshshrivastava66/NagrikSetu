import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import backendApi from "../api/backendApi";
import { useAuth } from "../context/AuthContext";

const STATUSES = ["Submitted", "Acknowledged", "Assigned", "In Progress", "Resolved", "Closed"];
const CATEGORIES = ["All", "Roads", "Water", "Electricity", "Sanitation", "Parks", "Safety", "Infrastructure", "Other"];

const STATUS_COLORS = {
  Submitted: "bg-amber-50 text-amber-700 border-amber-200",
  Acknowledged: "bg-blue-50 text-blue-700 border-blue-200",
  Assigned: "bg-purple-50 text-purple-700 border-purple-200",
  "In Progress": "bg-orange-50 text-orange-700 border-orange-200",
  Resolved: "bg-green-50 text-green-700 border-green-200",
  Closed: "bg-gray-100 text-gray-600 border-gray-200",
};

const CATEGORY_ICONS = {
  Roads: "🛣️",
  Water: "💧",
  Electricity: "⚡",
  Sanitation: "🗑️",
  Parks: "🌳",
  Safety: "🚨",
  Infrastructure: "🏗️",
  Other: "📋",
};

function GovDashboardPage() {
  const { user, loading: authLoading, logout } = useAuth();
  const navigate = useNavigate();

  const [issues, setIssues] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Redirect if not gov/admin
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate("/login");
      } else if (user.role !== "gov" && user.role !== "admin") {
        navigate("/");
      }
    }
  }, [user, authLoading]);

  useEffect(() => {
    if (user && (user.role === "gov" || user.role === "admin")) {
      fetchData();
    }
  }, [user, statusFilter, categoryFilter]);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const params = {};
      if (statusFilter !== "All") params.status = statusFilter;
      if (categoryFilter !== "All") params.category = categoryFilter;

      const [issuesRes, statsRes] = await Promise.all([
        backendApi.get("/issues", { params }),
        backendApi.get("/issues/gov/stats"),
      ]);

      setIssues(issuesRes.data.issues);
      setStats(statsRes.data.stats);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  // Update issue status
  const handleStatusChange = async (issueId, newStatus) => {
    setUpdatingId(issueId);
    try {
      await backendApi.patch(`/issues/${issueId}/status`, { status: newStatus });
      setIssues((prev) =>
        prev.map((issue) =>
          issue._id === issueId ? { ...issue, status: newStatus } : issue
        )
      );
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  // Client-side search filter
  const filteredIssues = issues.filter((issue) =>
    issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    issue.ward.toLowerCase().includes(searchQuery.toLowerCase()) ||
    issue.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#1a56db] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || (user.role !== "gov" && user.role !== "admin")) return null;

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
              <h1 className="text-sm font-bold text-white">Government Dashboard</h1>
              <p className="text-xs text-white/40">Manage civic issues</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-white/60">
              {user.name} <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full ml-1 uppercase">{user.role}</span>
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

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            {[
              { label: "Total Issues", value: stats.totalIssues, color: "text-[#1a56db]", bg: "bg-blue-50" },
              { label: "Submitted", value: stats.submitted, color: "text-amber-600", bg: "bg-amber-50" },
              { label: "In Progress", value: stats.inProgress, color: "text-orange-600", bg: "bg-orange-50" },
              { label: "Resolved", value: stats.resolved, color: "text-green-600", bg: "bg-green-50" },
              { label: "Closed", value: stats.closed, color: "text-gray-600", bg: "bg-gray-100" },
            ].map((stat) => (
              <div key={stat.label} className={`rounded-2xl border border-gray-200 p-4 ${stat.bg}`}>
                <div className={`text-2xl font-extrabold ${stat.color}`} style={{ fontFamily: "Sora, sans-serif" }}>
                  {stat.value}
                </div>
                <div className="text-xs text-gray-600 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="🔍 Search by title, city, or ward..."
              className="flex-1 px-4 py-2.5 text-sm rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-[#1a56db]/20 focus:border-[#1a56db]"
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 text-sm rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-[#1a56db]/20 focus:border-[#1a56db]"
            >
              <option value="All">All Statuses</option>
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2.5 text-sm rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-[#1a56db]/20 focus:border-[#1a56db]"
            >
              {CATEGORIES.map((c) => <option key={c} value={c}>{c === "All" ? "All Categories" : c}</option>)}
            </select>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        {/* Issues Table */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="text-sm font-bold text-[#0f1923]">All Issues</h2>
            <span className="text-xs text-gray-400">{filteredIssues.length} issues</span>
          </div>

          {filteredIssues.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-4xl mb-3">📭</div>
              <p className="text-sm text-gray-500">No issues match your filters</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-left">
                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Issue</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Votes</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Reported</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredIssues.map((issue) => (
                    <tr key={issue._id} className="hover:bg-gray-50 transition-all">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                            {issue.photo?.fileId ? (
                              <img
                                src={`http://localhost:5000/api/files/${issue.photo.fileId}`}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-lg">
                                {CATEGORY_ICONS[issue.category]}
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <Link
                              to={`/issues/${issue._id}`}
                              className="text-sm font-semibold text-[#0f1923] hover:text-[#1a56db] line-clamp-1"
                            >
                              {issue.title}
                            </Link>
                            <p className="text-xs text-gray-400">by {issue.reportedBy?.name || "Unknown"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-xs font-medium text-gray-600">
                          {CATEGORY_ICONS[issue.category]} {issue.category}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-xs text-gray-500">{issue.ward}, {issue.city}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-xs font-semibold text-gray-600">👍 {issue.votes}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-xs text-gray-400">
                          {new Date(issue.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${STATUS_COLORS[issue.status]}`}>
                          {issue.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={issue.status}
                          onChange={(e) => handleStatusChange(issue._id, e.target.value)}
                          disabled={updatingId === issue._id}
                          className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-[#1a56db]/20 focus:border-[#1a56db] disabled:opacity-50"
                        >
                          {STATUSES.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default GovDashboardPage;