import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import backendApi from "../api/backendApi";
import { useAuth } from "../context/AuthContext";

const CATEGORIES = [
  "Roads",
  "Water",
  "Electricity",
  "Sanitation",
  "Parks",
  "Safety",
  "Infrastructure",
];

function ReportIssuePage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    photoFileId: null,
    photoFilename: null,
    latitude: null,
    longitude: null,
    address: "",
    city: "",
    ward: "",
  });

  const [photoPreview, setPhotoPreview] = useState(null);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // ✅ Fill city & ward from user when user loads
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        city: user.city || "",
        ward: user.ward || "",
      }));
    }
  }, [user]);

  // Handle photo upload
  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // ✅ Set onload BEFORE readAsDataURL
    const reader = new FileReader();
    reader.onload = (event) => {
      setPhotoPreview(event.target.result);
    };
    reader.readAsDataURL(file);

    // Upload to GridFS
    setUploading(true);
    setError("");

    try {
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);

      const { data } = await backendApi.post("/files/upload", uploadFormData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setFormData((prev) => ({
        ...prev,
        photoFileId: data.fileId,
        photoFilename: data.filename,
      }));
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Photo upload failed. Try again.");
      setPhotoPreview(null);
      setFormData((prev) => ({
        ...prev,
        photoFileId: null,
        photoFilename: null,
      }));
    } finally {
      setUploading(false);
    }
  };

  // Get GPS location
  const handleGetLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormData((prev) => ({
            ...prev,
            latitude: latitude.toFixed(6),
            longitude: longitude.toFixed(6),
            address: `Lat: ${latitude.toFixed(4)}, Lon: ${longitude.toFixed(4)}`,
          }));
          setError("");
        },
        () => setError("Unable to get location. Please enable GPS.")
      );
    } else {
      setError("Geolocation not supported. Please enter coordinates manually.");
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setError("Please enter issue title");
      return;
    }
    if (!formData.description.trim()) {
      setError("Please enter issue description");
      return;
    }
    if (!formData.category) {
      setError("Please select a category");
      return;
    }
    if (!formData.photoFileId) {
      setError("Please upload a photo");
      return;
    }
    if (!formData.latitude || !formData.longitude) {
      setError("Please set your location");
      return;
    }
    if (!formData.city.trim()) {
      setError("Please enter your city");
      return;
    }
    if (!formData.ward.trim()) {
      setError("Please enter your ward");
      return;
    }

    setSubmitting(true);

    try {
      const { data } = await backendApi.post("/issues", {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        photoFileId: formData.photoFileId,
        photoFilename: formData.photoFilename,
        latitude: formData.latitude,
        longitude: formData.longitude,
        address: formData.address,
        city: formData.city,
        ward: formData.ward,
      });

      setSuccess(true);
      setTimeout(() => {
        navigate(`/issues/${data.issue._id}`);
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to report issue");
    } finally {
      setSubmitting(false);
    }
  };

  // Loading spinner
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#1a56db] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Redirect if not logged in
  if (!user) {
    navigate("/login");
    return null;
  }

  // Success screen
  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#0f766e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <h2 className="text-2xl font-extrabold text-[#0f1923] mb-2" style={{ fontFamily: "Sora, sans-serif" }}>
            Issue Reported!
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Thank you for reporting. Your issue has been submitted and will be reviewed by authorities.
          </p>
          <button
            onClick={() => navigate("/issues")}
            className="px-6 py-3 rounded-xl bg-[#1a56db] text-white text-sm font-bold hover:bg-[#1140a8] transition-all"
          >
            Browse All Issues
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-md p-8">

          {/* Header */}
          <h1 className="text-3xl font-extrabold text-[#0f1923] mb-2" style={{ fontFamily: "Sora, sans-serif" }}>
            Report an Issue
          </h1>
          <p className="text-gray-500 mb-8">
            Help improve your neighborhood. Report civic issues with photos and location.
          </p>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-6">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            onKeyDown={(e) => { if (e.key === "Enter") e.preventDefault(); }}
            className="space-y-6"
          >

            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-[#0f1923] mb-2">
                Issue Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Large pothole on MG Road"
                maxLength="100"
                className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-[#1a56db]/20 focus:border-[#1a56db]"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-[#0f1923] mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the issue in detail..."
                maxLength="500"
                rows="4"
                className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-[#1a56db]/20 focus:border-[#1a56db]"
              />
              <p className="text-xs text-gray-400 mt-1 text-right">
                {formData.description.length}/500
              </p>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-[#0f1923] mb-2">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-[#1a56db]/20 focus:border-[#1a56db]"
              >
                <option value="">Select a category</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Photo Upload */}
            <div>
              <label className="block text-sm font-semibold text-[#0f1923] mb-2">
                Photo *
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-[#1a56db] transition-all">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                  id="photo-input"
                />
                <label htmlFor="photo-input" className="cursor-pointer block">

                  {/* ✅ Always show preview if available */}
                  {photoPreview && (
                    <div className="mb-4">
                      <img
                        src={photoPreview}
                        alt="Preview"
                        className="w-full max-h-64 object-cover rounded-xl border border-gray-200 mx-auto"
                      />
                    </div>
                  )}

                  {/* Status below preview */}
                  {uploading ? (
                    <div className="flex items-center justify-center gap-2 text-[#1a56db] text-sm font-semibold mt-2">
                      <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                      </svg>
                      Uploading to server...
                    </div>
                  ) : photoPreview ? (
                    <div className="mt-2">
                      <p className="text-sm text-green-600 font-semibold">✓ Photo uploaded successfully</p>
                      <p className="text-xs text-gray-400 mt-1">Click to change photo</p>
                    </div>
                  ) : (
                    <div>
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#1a56db" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-3 opacity-50">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                      <p className="text-sm text-gray-600 font-medium">Click to upload photo</p>
                      <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-semibold text-[#0f1923] mb-2">
                Location *
              </label>
              <button
                type="button"
                onClick={handleGetLocation}
                className="w-full px-4 py-3 text-sm rounded-xl border border-[#1a56db] text-[#1a56db] font-semibold hover:bg-blue-50 transition-all mb-3"
              >
                📍 Get My Current Location
              </button>

              {formData.latitude && formData.longitude ? (
                <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl mb-3">
                  ✓ Location captured: {formData.address}
                </div>
              ) : (
                <div className="bg-gray-50 border border-gray-200 text-gray-500 text-sm px-4 py-3 rounded-xl mb-3">
                  💡 Click the button above to auto-detect your location
                </div>
              )}

              {/* Manual coordinate entry */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">
                    Latitude (manual)
                  </label>
                  <input
                    type="number"
                    name="latitude"
                    value={formData.latitude || ""}
                    onChange={handleChange}
                    placeholder="e.g. 22.7196"
                    step="0.0001"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-[#1a56db]/20 focus:border-[#1a56db]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">
                    Longitude (manual)
                  </label>
                  <input
                    type="number"
                    name="longitude"
                    value={formData.longitude || ""}
                    onChange={handleChange}
                    placeholder="e.g. 75.8577"
                    step="0.0001"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-[#1a56db]/20 focus:border-[#1a56db]"
                  />
                </div>
              </div>
            </div>

            {/* City & Ward */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#0f1923] mb-2">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Your city"
                  className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-[#1a56db]/20 focus:border-[#1a56db]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#0f1923] mb-2">
                  Ward *
                </label>
                <input
                  type="text"
                  name="ward"
                  value={formData.ward}
                  onChange={handleChange}
                  placeholder="Your ward"
                  className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-[#1a56db]/20 focus:border-[#1a56db]"
                />
              </div>
            </div>

  

            {/* Submit Button */}
            <button
              type="submit"
              disabled={
                submitting ||
                uploading ||
                !formData.photoFileId ||
                !formData.latitude ||
                !formData.longitude ||
                !formData.title.trim() ||
                !formData.description.trim() ||
                !formData.category ||
                !formData.city.trim() ||
                !formData.ward.trim()
              }
              className="w-full py-3.5 rounded-xl bg-[#1a56db] hover:bg-[#1140a8] text-white text-sm font-bold transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                  Reporting...
                </>
              ) : "Report Issue"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ReportIssuePage;