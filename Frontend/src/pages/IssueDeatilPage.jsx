import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import backendApi from "../api/backendApi";
import { useAuth } from "../context/AuthContext";


const STATUS_STEPS = [
  "Submitted",
  "Acknowledged",
  "Assigned",
  "In Progress",
  "Resolved",
  "Closed",
];

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

function IssueDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [upvoting, setUpvoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  // Comment states
  const [commentText, setCommentText] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentError, setCommentError] = useState("");

  useEffect(() => {
    fetchIssue();
  }, [id]);

  const fetchIssue = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await backendApi.get(`/issues/${id}`);
      setIssue(data.issue);

      // Check if current logged-in user already voted
      const alreadyVoted =
        user &&
        data.issue.upvotedBy?.some((u) => u._id === user._id || u === user._id);
      setHasVoted(alreadyVoted);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load issue");
    } finally {
      setLoading(false);
    }
  };
  // Handle upvote
  const handleUpvote = async () => {
    if (!user) {
      alert("Please login to upvote issues");
      return;
    }

    setUpvoting(true);
    try {
      const { data } = await backendApi.post(`/issues/${id}/upvote`);
      setIssue((prev) => ({ ...prev, votes: data.votes }));
      setHasVoted((prev) => !prev); // toggle voted state
    } catch (err) {
      console.error(err);
    } finally {
      setUpvoting(false);
    }
  };

  // Handle comment submit
  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      navigate("/login");
      return;
    }

    if (!commentText.trim()) {
      setCommentError("Please write a comment");
      return;
    }

    setCommentLoading(true);
    setCommentError("");

    try {
      const { data } = await backendApi.post(`/issues/${id}/comment`, {
        text: commentText.trim(),
      });

      // Add new comment to issue locally
      setIssue((prev) => ({
        ...prev,
        comments: [...prev.comments, data.comment],
      }));
      setCommentText("");
    } catch (err) {
      setCommentError(err.response?.data?.message || "Failed to add comment");
    } finally {
      setCommentLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#1a56db] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="text-center">
          <div className="text-5xl mb-4">❌</div>
          <h2 className="text-xl font-bold text-[#0f1923] mb-2">
            Issue not found
          </h2>
          <p className="text-sm text-gray-500 mb-5">{error}</p>
          <Link
            to="/issues"
            className="px-5 py-2.5 rounded-xl bg-[#1a56db] text-white text-sm font-bold hover:bg-[#1140a8] transition-all"
          >
            Back to Issues
          </Link>
        </div>
      </div>
    );
  }

  if (!issue) return null;

  const currentStepIndex = STATUS_STEPS.indexOf(issue.status);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-[#0f1923] mb-6 transition-colors"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column — main content */}
          <div className="lg:col-span-2 space-y-5">
            {/* Photo */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              {issue.photo?.fileId ? (
                <img
                  src={`http://localhost:5000/api/files/${issue.photo.fileId}`}
                  alt={issue.title}
                  className="w-full max-h-80 object-cover"
                />
              ) : (
                <div className="h-48 flex items-center justify-center text-6xl bg-gray-50">
                  {CATEGORY_ICONS[issue.category] || "📋"}
                </div>
              )}
            </div>

            {/* Title & Info */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">
                  {CATEGORY_ICONS[issue.category]}
                </span>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {issue.category}
                </span>
                <span
                  className={`ml-auto text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${STATUS_COLORS[issue.status]}`}
                >
                  {issue.status}
                </span>
              </div>

              <h1
                className="text-2xl font-extrabold text-[#0f1923] mb-3"
                style={{ fontFamily: "Sora, sans-serif" }}
              >
                {issue.title}
              </h1>

              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                {issue.description}
              </p>

              <div className="flex flex-wrap gap-4 text-xs text-gray-500 pt-4 border-t border-gray-100">
                <span className="flex items-center gap-1">
                  📍 {issue.ward}, {issue.city}
                </span>
                <span className="flex items-center gap-1">
                  👤 Reported by {issue.reportedBy?.name || "Anonymous"}
                </span>
                <span className="flex items-center gap-1">
                  🕐{" "}
                  {new Date(issue.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>

            {/* Comments Section */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-base font-bold text-[#0f1923] mb-5">
                💬 Comments ({issue.comments?.length || 0})
              </h2>

              {/* Comment form */}
              {user ? (
                <form onSubmit={handleCommentSubmit} className="mb-6">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#1a56db] flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-1">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <textarea
                        value={commentText}
                        onChange={(e) => {
                          setCommentText(e.target.value);
                          setCommentError("");
                        }}
                        placeholder="Write a comment..."
                        rows="3"
                        className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-[#1a56db]/20 focus:border-[#1a56db] resize-none"
                      />
                      {commentError && (
                        <p className="text-xs text-red-500 mt-1">
                          {commentError}
                        </p>
                      )}
                      <div className="flex justify-end mt-2">
                        <button
                          type="submit"
                          disabled={commentLoading || !commentText.trim()}
                          className="px-4 py-2 rounded-xl bg-[#1a56db] hover:bg-[#1140a8] text-white text-xs font-bold transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          {commentLoading ? (
                            <>
                              <svg
                                className="animate-spin"
                                width="13"
                                height="13"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                              >
                                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                              </svg>
                              Posting...
                            </>
                          ) : (
                            "Post Comment"
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              ) : (
                <div className="bg-blue-50 border border-blue-200 text-blue-700 text-sm px-4 py-3 rounded-xl mb-6 flex items-center justify-between">
                  <span>Login to post a comment</span>
                  <Link
                    to="/login"
                    className="text-xs font-bold hover:underline"
                  >
                    Login →
                  </Link>
                </div>
              )}

              {/* Comments list */}
              {issue.comments?.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <p className="text-sm">
                    No comments yet. Be the first to comment!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {issue.comments.map((comment, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs font-bold flex-shrink-0">
                        {comment.userName?.charAt(0).toUpperCase() || "A"}
                      </div>
                      <div className="flex-1 bg-gray-50 rounded-xl px-4 py-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-[#0f1923]">
                            {comment.userName || "Anonymous"}
                          </span>
                          <span className="text-[10px] text-gray-400">
                            {new Date(comment.createdAt).toLocaleDateString(
                              "en-IN",
                              {
                                day: "numeric",
                                month: "short",
                              },
                            )}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{comment.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right column — sidebar */}
          <div className="space-y-5">
            {/* Upvote Card */}
            <button
              onClick={handleUpvote}
              disabled={upvoting}
              className={`w-full py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2
    ${
      hasVoted
        ? "bg-blue-50 text-[#1a56db] border border-[#1a56db]"
        : "bg-[#1a56db] hover:bg-[#1140a8] text-white"
    } disabled:opacity-60`}
            >
              {upvoting ? (
                <svg
                  className="animate-spin"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
              ) : (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="18 15 12 9 6 15" />
                </svg>
              )}
              {hasVoted ? "Voted ✓ (click to remove)" : "vote Issue"}
            </button>

            {!user && (
              <p className="text-xs text-gray-400 mt-2">
                Login required to vote
              </p>
            )}
            {/* Status Timeline */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="text-sm font-bold text-[#0f1923] mb-4">
                Issue Timeline
              </h3>
              <div className="space-y-3">
                {STATUS_STEPS.map((step, i) => {
                  const isDone = i <= currentStepIndex;
                  const isCurrent = i === currentStepIndex;
                  return (
                    <div key={step} className="flex items-center gap-3">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold transition-all
                        ${
                          isCurrent
                            ? "bg-[#1a56db] text-white ring-4 ring-blue-100"
                            : isDone
                              ? "bg-[#1a56db] text-white"
                              : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {isDone ? (
                          isCurrent ? (
                            "●"
                          ) : (
                            "✓"
                          )
                        ) : (
                          <span className="w-2 h-2 rounded-full bg-gray-300" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p
                          className={`text-xs font-semibold ${isDone ? "text-[#0f1923]" : "text-gray-400"}`}
                        >
                          {step}
                        </p>
                      </div>
                      {isCurrent && (
                        <span className="text-[10px] font-bold text-[#1a56db] bg-blue-50 px-2 py-0.5 rounded-full">
                          Current
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Issue Details Card */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="text-sm font-bold text-[#0f1923] mb-4">
                Issue Details
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Category</span>
                  <span className="font-semibold text-[#0f1923]">
                    {CATEGORY_ICONS[issue.category]} {issue.category}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">City</span>
                  <span className="font-semibold text-[#0f1923]">
                    {issue.city}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Ward</span>
                  <span className="font-semibold text-[#0f1923]">
                    {issue.ward}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Reported on</span>
                  <span className="font-semibold text-[#0f1923]">
                    {new Date(issue.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Comments</span>
                  <span className="font-semibold text-[#0f1923]">
                    {issue.comments?.length || 0}
                  </span>
                </div>
                {issue.location?.address && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Location</span>
                    <span className="font-semibold text-[#0f1923] text-right text-xs max-w-32">
                      {issue.location.address}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Share Card */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="text-sm font-bold text-[#0f1923] mb-3">
                Share this issue
              </h3>
              <p className="text-xs text-gray-500 mb-3">
                Help spread awareness by sharing
              </p>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert("Link copied to clipboard!");
                }}
                className="w-full py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-sm font-semibold text-gray-600 transition-all flex items-center justify-center gap-2"
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                Copy Link
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default IssueDetailPage;
