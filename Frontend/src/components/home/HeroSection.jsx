import { Link } from "react-router-dom";

const issues = [
  { id: 1, title: "Large pothole — MG Road near Palasia", meta: "Roads · 2 hrs ago · Ward 12", votes: 84, iconBg: "bg-amber-50", iconColor: "#b45309",
    icon: <><circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01"/></> },
  { id: 2, title: "Overflowing drain — Vijay Nagar colony", meta: "Drainage · In progress · Ward 7", votes: 61, iconBg: "bg-blue-50", iconColor: "#1d4ed8",
    icon: <><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></> },
  { id: 3, title: "Street light out — Rajwada chowk", meta: "Electricity · Resolved ✓ · Ward 3", votes: 38, iconBg: "bg-purple-50", iconColor: "#7e22ce",
    icon: <><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></> },
  { id: 4, title: "Garbage not collected — Saket Nagar", meta: "Sanitation · Assigned · Ward 18", votes: 29, iconBg: "bg-emerald-50", iconColor: "#065f46",
    icon: <><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></> },
];

const HeroSection = () => (
  <section className="relative bg-white pt-20 overflow-hidden">
    {/* Background radial glow */}
    <div className="absolute inset-0 pointer-events-none"
      style={{ background: "radial-gradient(ellipse 70% 50% at 60% 0%, #dce9ff 0%, transparent 70%)" }} />

    <div className="relative max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

      {/* Left: Copy */}
      <div>
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-xs font-semibold tracking-wider uppercase px-3 py-1.5 rounded-full mb-5">
          <span className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
          Civic Issue Platform
        </div>

        <h1 className="text-5xl xl:text-6xl font-extrabold leading-tight tracking-tight text-[#0f1923] mb-5" style={{ fontFamily: "Sora, sans-serif", letterSpacing: "-1.5px" }}>
          Your city.<br />Your voice.<br />
          <em className="not-italic text-[#1a56db]">Your fix.</em>
        </h1>

        <p className="text-lg text-gray-500 leading-relaxed max-w-lg mb-8">
          Report potholes, broken lights, drainage issues, and more — directly to your municipality. Track every issue until it's resolved.
        </p>

        <div className="flex flex-wrap items-center gap-3 mb-8">
          <Link to="/report" className="flex items-center gap-2 text-base font-semibold text-white bg-[#1a56db] hover:bg-[#1140a8] px-7 py-3.5 rounded-xl transition-all">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
            </svg>
            Report an issue
          </Link>
          <Link to="/issues" className="text-base font-semibold text-[#0f1923] border border-gray-200 hover:bg-gray-50 px-7 py-3.5 rounded-xl transition-all">
            View open issues
          </Link>
        </div>

        <div className="flex flex-wrap gap-5 text-sm text-gray-500 mb-16">
          {["Free for citizens", "Verified responses", "Real-time tracking"].map((t) => (
            <span key={t} className="flex items-center gap-1.5">
              <svg width="15" height="15" fill="none" stroke="#0f766e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Right: Live issues card */}
      <div className="hidden lg:block relative pt-10 pb-10">
        {/* Top badge */}
        <div className="absolute -top-2 right-3 flex items-center gap-2 bg-white border border-gray-200 shadow-md rounded-xl px-3.5 py-2.5 text-xs font-semibold text-[#0f1923] z-10">
          <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_0_3px_#dcfce7]" />
          247 issues resolved today
        </div>

        <div className="bg-white border border-gray-200 rounded-3xl shadow-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-[#0f1923]">Recent issues — Indore</span>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-green-50 text-green-700 px-2.5 py-1 rounded-full">Live</span>
          </div>

          <div className="flex flex-col">
            {issues.map((issue, i) => (
              <div key={issue.id} className={`flex items-center gap-3 py-3 ${i < issues.length - 1 ? "border-b border-gray-50" : ""}`}>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${issue.iconBg}`}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={issue.iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {issue.icon}
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-[#0f1923] truncate mb-0.5">{issue.title}</p>
                  <p className="text-[11px] text-gray-400">{issue.meta}</p>
                </div>
                <div className="flex flex-col items-center gap-0.5 text-[11px] font-semibold text-gray-400">
                  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <polyline points="18 15 12 9 6 15"/>
                  </svg>
                  {issue.votes}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom badge */}
        <div className="absolute -bottom-2 left-4 flex items-center gap-2 bg-white border border-gray-200 shadow-md rounded-xl px-3.5 py-2.5 text-xs font-semibold text-[#0f1923]">
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          Avg. resolution: 4.2 days
        </div>
      </div>
    </div>
  </section>
);

export default HeroSection;