import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import backendApi from "../api/backendApi";
import { useAuth } from "../context/AuthContext";

const CATEGORIES = ["All", "Roads", "Water", "Electricity", "Sanitation", "Parks", "Safety", "Infrastructure", "Other"];
const STATUSES = ["All", "Submitted", "Acknowledged", "Assigned", "In Progress", "Resolved", "Closed"];

const STATUS_COLORS = {
  Submitted: "bg-amber-50 text-amber-700",
  Acknowledged: "bg-blue-50 text-blue-700",
  Assigned: "bg-purple-50 text-purple-700",
  "In Progress": "bg-orange-50 text-orange-700",
  Resolved: "bg-green-50 text-green-700",
  Closed: "bg-gray-100 text-gray-600",
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

function BrowseIssuesPage() {
  const { user } = useAuth();

  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest"); // newest | votes

  // Fetch issues
  const fetchIssues = async () => {
    setLoading(true);
    setError("");

    try {
      const params = {};
      if (categoryFilter !== "All") params.category = categoryFilter;
      if (statusFilter !== "All") params.status = statusFilter;

      const { data } = await backendApi.get("/issues", { params });
      setIssues(data.issues);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load issues");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, [categoryFilter, statusFilter]);

  // Handle upvote
  const handleUpvote = async (issueId, e) => {
    e.preventDefault(); // prevent navigating to detail page
    e.stopPropagation();

    if (!user) {
      alert("Please login to upvote issues");
      return;
    }

    try {
      const { data } = await backendApi.post(`/issues/${issueId}/upvote`);
      // Update vote count locally
      setIssues((prev) =>
        prev.map((issue) =>
          issue._id === issueId ? { ...issue, votes: data.votes } : issue
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  // Filter by search query (client-side)
  const filteredIssues = issues.filter((issue) =>
    issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    issue.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort issues
  const sortedIssues = [...filteredIssues].sort((a, b) => {
    if (sortBy === "votes") return b.votes - a.votes;
    return new Date(b.createdAt) - new Date(a.createdAt); // newest first
  });

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-[#0f1923] mb-2" style={{ fontFamily: "Sora, sans-serif" }}>
            Browse Issues
          </h1>
          <p className="text-gray-500">
            See what's happening in your city. Upvote issues that matter to you.
          </p>
        </div>

        {/* Filters Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            
            {/* Search */}
            <div className="flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="🔍 Search issues..."
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-[#1a56db]/20 focus:border-[#1a56db]"
              />
            </div>

            {/* Category filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2.5 text-sm rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-[#1a56db]/20 focus:border-[#1a56db]"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat === "All" ? "All Categories" : cat}</option>
              ))}
            </select>

            {/* Status filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 text-sm rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-[#1a56db]/20 focus:border-[#1a56db]"
            >
              {STATUSES.map((status) => (
                <option key={status} value={status}>{status === "All" ? "All Statuses" : status}</option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2.5 text-sm rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-[#1a56db]/20 focus:border-[#1a56db]"
            >
              <option value="newest">Newest first</option>
              <option value="votes">Most upvoted</option>
            </select>
          </div>

          {/* Active filters count */}
          {(categoryFilter !== "All" || statusFilter !== "All" || searchQuery) && (
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
              <span className="text-xs text-gray-500">Showing {sortedIssues.length} results</span>
              <button
                onClick={() => {
                  setCategoryFilter("All");
                  setStatusFilter("All");
                  setSearchQuery("");
                }}
                className="text-xs text-[#1a56db] font-semibold hover:underline ml-2"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-[#1a56db] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : sortedIssues.length === 0 ? (
          /* Empty state */
          <div className="bg-white rounded-2xl border border-gray-200 py-20 text-center">
            <div className="text-5xl mb-4">📭</div>
            <h3 className="text-lg font-bold text-[#0f1923] mb-2">No issues found</h3>
            <p className="text-sm text-gray-500 mb-6">Try adjusting your filters or be the first to report an issue!</p>
            <Link
              to="/report"
              className="inline-block px-6 py-3 rounded-xl bg-[#1a56db] text-white text-sm font-bold hover:bg-[#1140a8] transition-all"
            >
              Report an Issue
            </Link>
          </div>
        ) : (
          /* Issues Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {sortedIssues.map((issue) => (
              <Link
                key={issue._id}
                to={`/issues/${issue._id}`}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all"
              >
                {/* Photo */}
                <div className="h-44 bg-gray-100 relative overflow-hidden">
                  {issue.photo?.fileId ? (
                    <img
                      src={`http://localhost:5000/api/files/${issue.photo.fileId}`}
                      alt={issue.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">
                      {CATEGORY_ICONS[issue.category] || "📋"}
                    </div>
                  )}

                  {/* Status badge */}
                  <span className={`absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${STATUS_COLORS[issue.status]}`}>
                    {issue.status}
                  </span>
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="text-sm">{CATEGORY_ICONS[issue.category] || "📋"}</span>
                    <span className="text-xs font-semibold text-gray-500">{issue.category}</span>
                  </div>

                  <h3 className="text-sm font-bold text-[#0f1923] mb-1.5 line-clamp-2">
                    {issue.title}
                  </h3>

                  <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                    {issue.description}
                  </p>

                  <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                    <span>📍 {issue.ward}, {issue.city}</span>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <span className="text-xs text-gray-400">
                      {new Date(issue.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    </span>

                    <button
                      onClick={(e) => handleUpvote(issue._id, e)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 hover:bg-blue-50 hover:text-[#1a56db] transition-all text-xs font-semibold text-gray-600"
                    >
                      Vote 👍 {issue.votes}
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default BrowseIssuesPage;