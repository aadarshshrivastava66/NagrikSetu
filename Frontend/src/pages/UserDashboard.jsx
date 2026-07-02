import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import backendApi from "../api/backendApi";
import { useAuth } from "../context/AuthContext";

const STATUS_COLORS = {
  Submitted: "bg-amber-50 text-amber-700 border-amber-200",
  Acknowledged: "bg-blue-50 text-blue-700 border-blue-200",
  Assigned: "bg-purple-50 text-purple-700 border-purple-200",
  "In Progress": "bg-orange-50 text-orange-700 border-orange-200",
  Resolved: "bg-green-50 text-green-700 border-green-200",
  Closed: "bg-gray-100 text-gray-600 border-gray-200",
};

const STATUS_STEPS = ["Submitted", "Acknowledged", "Assigned", "In Progress", "Resolved", "Closed"];

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

function UserDashboardPage() {
  const { user, loading: authLoading, logout } = useAuth();
  const navigate = useNavigate();

  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("all"); // all | active | resolved

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading]);

  useEffect(() => {
    if (user) fetchMyIssues();
  }, [user]);

  const fetchMyIssues = async () => {
    setLoading(true);
    try {
      const { data } = await backendApi.get("/issues/user/my-issues");
      setIssues(data.issues);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load your issues");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  // Stats
  const totalIssues = issues.length;
  const resolvedIssues = issues.filter((i) => i.status === "Resolved" || i.status === "Closed").length;
  const activeIssues = issues.filter((i) => i.status !== "Resolved" && i.status !== "Closed").length;
  const totalVotes = issues.reduce((sum, i) => sum + i.votes, 0);

  // Filter by tab
  const filteredIssues = issues.filter((issue) => {
    if (activeTab === "active") return issue.status !== "Resolved" && issue.status !== "Closed";
    if (activeTab === "resolved") return issue.status === "Resolved" || issue.status === "Closed";
    return true;
  });

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#1a56db] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-5xl mx-auto">

        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="w-14 h-14 rounded-full bg-[#1a56db] flex items-center justify-center text-white text-xl font-extrabold flex-shrink-0">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-[#0f1923]" style={{ fontFamily: "Sora, sans-serif" }}>
                  {user.name}
                </h1>
                <p className="text-sm text-gray-500">{user.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  {user.city && (
                    <span className="text-xs text-gray-400">📍 {user.city}</span>
                  )}
                  {user.ward && (
                    <span className="text-xs text-gray-400">• {user.ward}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 md:grid-cols-3 gap-4 mb-6">
          {[
            { label: "Total Reported", value: totalIssues, icon: "📋", color: "text-[#1a56db]" },
            { label: "Active Issues", value: activeIssues, icon: "🔄", color: "text-amber-600" },
            { label: "Resolved", value: resolvedIssues, icon: "✅", color: "text-green-600" },
        
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl border border-gray-200 p-4 text-center">
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className={`text-2xl font-extrabold ${stat.color}`} style={{ fontFamily: "Sora, sans-serif" }}>
                {stat.value}
              </div>
              <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* My Issues Section */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">

          {/* Section header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="text-base font-bold text-[#0f1923]">My Reported Issues</h2>
            <span className="text-xs text-gray-400">{filteredIssues.length} issues</span>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-100 px-6">
            {[
              { key: "all", label: "All" },
              { key: "active", label: "Active" },
              { key: "resolved", label: "Resolved" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`py-3 px-4 text-sm font-semibold border-b-2 transition-all mr-2
                  ${activeTab === tab.key
                    ? "border-[#1a56db] text-[#1a56db]"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div className="mx-6 mt-4 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          {/* Loading */}
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-8 h-8 border-4 border-[#1a56db] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredIssues.length === 0 ? (
            <div className="text-center py-16 px-6">
              <div className="text-5xl mb-3">📭</div>
              <h3 className="text-base font-bold text-[#0f1923] mb-2">No issues here</h3>
              <p className="text-sm text-gray-500 mb-5">
                {activeTab === "all"
                  ? "You haven't reported any issues yet."
                  : activeTab === "active"
                  ? "You have no active issues."
                  : "You have no resolved issues yet."}
              </p>
              <Link
                to="/report"
                className="inline-block px-5 py-2.5 rounded-xl bg-[#1a56db] text-white text-sm font-bold hover:bg-[#1140a8] transition-all"
              >
                Report your first issue
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredIssues.map((issue) => (
                <div key={issue._id} className="p-5 hover:bg-gray-50 transition-all">
                  <div className="flex gap-4">

                    {/* Photo thumbnail */}
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                      {issue.photo?.fileId ? (
                        <img
                          src={`http://localhost:5000/api/files/${issue.photo.fileId}`}
                          alt={issue.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">
                          {CATEGORY_ICONS[issue.category] || "📋"}
                        </div>
                      )}
                    </div>

                    {/* Issue info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <Link
                          to={`/issues/${issue._id}`}
                          className="text-sm font-bold text-[#0f1923] hover:text-[#1a56db] transition-colors line-clamp-1"
                        >
                          {issue.title}
                        </Link>
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border flex-shrink-0 ${STATUS_COLORS[issue.status]}`}>
                          {issue.status}
                        </span>
                      </div>

                      <p className="text-xs text-gray-500 mb-2 line-clamp-1">
                        {issue.description}
                      </p>

                      {/* Status progress bar */}
                      <div className="flex items-center gap-1 mb-2">
                        {STATUS_STEPS.map((step, i) => {
                          const currentIndex = STATUS_STEPS.indexOf(issue.status);
                          return (
                            <div
                              key={step}
                              className={`h-1 flex-1 rounded-full transition-all ${
                                i <= currentIndex ? "bg-[#1a56db]" : "bg-gray-200"
                              }`}
                            />
                          );
                        })}
                      </div>

                      {/* Meta info */}
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <span>{CATEGORY_ICONS[issue.category]} {issue.category}</span>
                        <span>•</span>
                        <span>📍 {issue.ward}, {issue.city}</span>
                        <span>•</span>
                        <span>
                          {new Date(issue.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-2 mt-3 ml-20">
                    <Link
                      to={`/issues/${issue._id}`}
                      className="text-xs font-semibold text-[#1a56db] hover:underline"
                    >
                      View details →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserDashboardPage;