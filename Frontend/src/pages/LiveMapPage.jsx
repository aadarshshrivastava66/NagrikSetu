import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import backendApi from "../api/backendApi";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const CATEGORIES = ["All", "Roads", "Water", "Electricity", "Sanitation", "Parks", "Safety", "Infrastructure"];
const STATUSES = ["All", "Submitted", "Acknowledged", "Assigned", "In Progress", "Resolved", "Closed"];

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

const STATUS_COLORS = {
  Submitted: "#f59e0b",
  Acknowledged: "#3b82f6",
  Assigned: "#a855f7",
  "In Progress": "#f97316",
  Resolved: "#22c55e",
  Closed: "#6b7280",
};

// Fix default marker icon issue with Leaflet + bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function LiveMapPage() {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedIssue, setSelectedIssue] = useState(null);

  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

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

  // Initialize map once
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current).setView([22.7196, 75.8577], 12); // Default: Indore

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update markers whenever issues change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear old markers
    markersRef.current.forEach((marker) => map.removeLayer(marker));
    markersRef.current = [];

    if (issues.length === 0) return;

    const bounds = [];

    issues.forEach((issue) => {
      const lat = issue.location?.latitude;
      const lng = issue.location?.longitude;
      if (!lat || !lng) return;

      const color = STATUS_COLORS[issue.status] || "#6b7280";

      // Custom colored marker icon
      const customIcon = L.divIcon({
        className: "custom-marker",
        html: `
          <div style="
            background: ${color};
            width: 28px;
            height: 28px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            border: 2px solid white;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <span style="transform: rotate(45deg); font-size: 12px;">${CATEGORY_ICONS[issue.category] || "📋"}</span>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 28],
      });

      const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);

      marker.on("click", () => {
        setSelectedIssue(issue);
      });

      markersRef.current.push(marker);
      bounds.push([lat, lng]);
    });

    // Fit map to show all markers
    if (bounds.length > 0) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }
  }, [issues]);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-5">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-extrabold text-[#0f1923] mb-1" style={{ fontFamily: "Sora, sans-serif" }}>
            Live Issue Map
          </h1>
          <p className="text-sm text-gray-500">
            See all reported civic issues in your city on the map
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-5 flex flex-col sm:flex-row gap-3">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2.5 text-sm rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-[#1a56db]/20 focus:border-[#1a56db]"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c === "All" ? "All Categories" : c}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 text-sm rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-[#1a56db]/20 focus:border-[#1a56db]"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s === "All" ? "All Statuses" : s}</option>
            ))}
          </select>

          <span className="flex items-center text-xs text-gray-400 px-2">
            📍 {issues.length} issue{issues.length !== 1 ? "s" : ""} on map
          </span>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-5">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Map */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 overflow-hidden relative">
            {loading && (
              <div className="absolute inset-0 bg-white/70 z-[1000] flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-[#1a56db] border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            <div ref={mapContainerRef} style={{ height: "600px", width: "100%" }} />
          </div>

          {/* Sidebar */}
          <div className="space-y-4">

            {/* Legend */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <h3 className="text-sm font-bold text-[#0f1923] mb-3">Status Legend</h3>
              <div className="space-y-2">
                {Object.entries(STATUS_COLORS).map(([status, color]) => (
                  <div key={status} className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: color }} />
                    <span className="text-xs text-gray-600">{status}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Selected Issue Card */}
            {selectedIssue ? (
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                {selectedIssue.photo?.fileId && (
                  <img
                    src={`http://localhost:5000/api/files/${selectedIssue.photo.fileId}`}
                    alt={selectedIssue.title}
                    className="w-full h-36 object-cover"
                  />
                )}
                <div className="p-4">
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="text-sm">{CATEGORY_ICONS[selectedIssue.category]}</span>
                    <span className="text-xs font-semibold text-gray-500">{selectedIssue.category}</span>
                    <span
                      className="ml-auto text-[10px] font-bold uppercase px-2 py-0.5 rounded-full text-white"
                      style={{ background: STATUS_COLORS[selectedIssue.status] }}
                    >
                      {selectedIssue.status}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-[#0f1923] mb-1.5 line-clamp-2">
                    {selectedIssue.title}
                  </h4>
                  <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                    {selectedIssue.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                    <span>📍 {selectedIssue.ward}, {selectedIssue.city}</span>
                    <span>👍 {selectedIssue.votes}</span>
                  </div>
                  <Link
                    to={`/issues/${selectedIssue._id}`}
                    className="block text-center py-2.5 rounded-xl bg-[#1a56db] text-white text-xs font-bold hover:bg-[#1140a8] transition-all"
                  >
                    View Full Details
                  </Link>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
                <div className="text-3xl mb-2">👆</div>
                <p className="text-xs text-gray-500">
                  Click on any marker to see issue details
                </p>
              </div>
            )}

            {/* Report CTA */}
            <Link
              to="/report"
              className="block text-center py-3 rounded-2xl bg-[#0f1923] text-white text-sm font-bold hover:bg-[#1a2937] transition-all"
            >
              + Report New Issue
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LiveMapPage;