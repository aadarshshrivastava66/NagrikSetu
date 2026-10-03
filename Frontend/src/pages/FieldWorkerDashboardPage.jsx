import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import backendApi from "../api/backendApi";
import { useAuth } from "../context/AuthContext";

const STATUS_COLORS = {
  Assigned: "bg-purple-50 text-purple-700 border-purple-200",
  "In Progress": "bg-orange-50 text-orange-700 border-orange-200",
  Resolved: "bg-green-50 text-green-700 border-green-200",
};

function FieldWorkerDashboardPage() {
  const { user, loading: authLoading, logout } = useAuth();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Resolve modal state
  const [resolvingTask, setResolvingTask] = useState(null);
  const [resolutionPreview, setResolutionPreview] = useState(null);
  const [resolutionFileId, setResolutionFileId] = useState(null);
  const [resolutionFilename, setResolutionFilename] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading) {
      if (!user) navigate("/login");
      else if (user.role !== "fieldworker") navigate("/");
    }
  }, [user, authLoading]);

  useEffect(() => {
    if (user?.role === "fieldworker") fetchTasks();
  }, [user]);

  const fetchTasks = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await backendApi.get("/issues/fieldworker/my-tasks");
      setTasks(data.issues);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const openResolveModal = (task) => {
    setResolvingTask(task);
    setResolutionPreview(null);
    setResolutionFileId(null);
    setResolutionFilename(null);
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => setResolutionPreview(event.target.result);
    reader.readAsDataURL(file);

    setUploading(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);

      const { data } = await backendApi.post("/files/upload", uploadFormData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setResolutionFileId(data.fileId);
      setResolutionFilename(data.filename);
    } catch (err) {
      alert("Photo upload failed");
      setResolutionPreview(null);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmitResolution = async () => {
    if (!resolutionFileId) {
      alert("Please upload a resolution photo");
      return;
    }

    setSubmitting(true);
    try {
      await backendApi.patch(`/issues/${resolvingTask._id}/resolve`, {
        resolutionFileId,
        resolutionFilename,
      });

      setTasks((prev) =>
        prev.map((t) => (t._id === resolvingTask._id ? { ...t, status: "Resolved" } : t))
      );
      setResolvingTask(null);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to mark as resolved");
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#1a56db] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || user.role !== "fieldworker") return null;

  const pendingTasks = tasks.filter((t) => t.status !== "Resolved" && t.status !== "Closed");
  const completedTasks = tasks.filter((t) => t.status === "Resolved" || t.status === "Closed");

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="bg-[#0f1923] px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#1a56db] flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
              </svg>
            </div>
            <div>
              <h1 className="text-sm font-bold text-white">Field Worker Dashboard</h1>
              <p className="text-xs text-white/40">{user.department} · {user.city}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-white/60">{user.name}</span>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-lg border border-white/20 text-white/80 text-xs font-semibold hover:bg-white/10 transition-all"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-gray-200 p-5 text-center">
            <div className="text-3xl font-extrabold text-amber-600" style={{ fontFamily: "Sora, sans-serif" }}>
              {pendingTasks.length}
            </div>
            <div className="text-xs text-gray-500 mt-1">Pending Tasks</div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-5 text-center">
            <div className="text-3xl font-extrabold text-green-600" style={{ fontFamily: "Sora, sans-serif" }}>
              {completedTasks.length}
            </div>
            <div className="text-xs text-gray-500 mt-1">Completed</div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        {/* Pending Tasks */}
        <h2 className="text-sm font-bold text-[#0f1923] mb-3">Pending Tasks</h2>
        {pendingTasks.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 py-12 text-center mb-8">
            <div className="text-3xl mb-2">✅</div>
            <p className="text-sm text-gray-500">No pending tasks right now</p>
          </div>
        ) : (
          <div className="space-y-3 mb-8">
            {pendingTasks.map((task) => (
              <div key={task._id} className="bg-white rounded-2xl border border-gray-200 p-5 flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                  {task.photo?.fileId && (
                    <img src={`http://localhost:5000/api/files/${task.photo.fileId}`} alt="" className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <Link to={`/issues/${task._id}`} className="text-sm font-bold text-[#0f1923] hover:text-[#1a56db] line-clamp-1">
                    {task.title}
                  </Link>
                  <p className="text-xs text-gray-400">📍 {task.ward}, {task.city}</p>
                  <span className={`inline-block mt-1.5 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${STATUS_COLORS[task.status]}`}>
                    {task.status}
                  </span>
                </div>
                <button
                  onClick={() => openResolveModal(task)}
                  className="px-4 py-2 rounded-xl bg-[#1a56db] hover:bg-[#1140a8] text-white text-xs font-bold transition-all flex-shrink-0"
                >
                  Mark Resolved
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Completed */}
        <h2 className="text-sm font-bold text-[#0f1923] mb-3">Completed</h2>
        {completedTasks.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 py-8 text-center">
            <p className="text-sm text-gray-400">No completed tasks yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {completedTasks.map((task) => (
              <div key={task._id} className="bg-white rounded-2xl border border-gray-200 p-5 flex items-center gap-4 opacity-75">
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                  {task.resolutionPhoto?.fileId ? (
                    <img src={`http://localhost:5000/api/files/${task.resolutionPhoto.fileId}`} alt="" className="w-full h-full object-cover" />
                  ) : task.photo?.fileId && (
                    <img src={`http://localhost:5000/api/files/${task.photo.fileId}`} alt="" className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[#0f1923] line-clamp-1">{task.title}</p>
                  <p className="text-xs text-gray-400">📍 {task.ward}, {task.city}</p>
                </div>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border bg-green-50 text-green-700 border-green-200">
                  {task.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Resolve Modal */}
      {resolvingTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-6">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-[#0f1923] mb-1">Upload Resolution Proof</h3>
            <p className="text-sm text-gray-500 mb-5 line-clamp-1">{resolvingTask.title}</p>

            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center mb-5 hover:border-[#1a56db] transition-all">
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
                id="resolution-photo-input"
              />
              <label htmlFor="resolution-photo-input" className="cursor-pointer block">
                {resolutionPreview ? (
                  <img src={resolutionPreview} alt="Resolution" className="w-full max-h-52 object-cover rounded-xl mx-auto" />
                ) : (
                  <div>
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#1a56db" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-2 opacity-50">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                      <circle cx="8.5" cy="8.5" r="1.5"/>
                      <polyline points="21 15 16 10 5 21"/>
                    </svg>
                    <p className="text-sm text-gray-600">Upload photo of resolved issue</p>
                  </div>
                )}
                {uploading && <p className="text-xs text-[#1a56db] font-semibold mt-2">Uploading...</p>}
              </label>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setResolvingTask(null)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitResolution}
                disabled={!resolutionFileId || submitting || uploading}
                className="flex-1 py-2.5 rounded-xl bg-[#1a56db] text-white text-sm font-bold hover:bg-[#1140a8] disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Confirm Resolved"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FieldWorkerDashboardPage;