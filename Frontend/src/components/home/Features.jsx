const features = [
  { title: "GPS geo-tagging", desc: "Every report is auto-pinned to an exact location. No ward number needed — routing is handled automatically.", bg: "bg-blue-50", stroke: "#1d4ed8",
    icon: <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></> },
  { title: "Live status tracking", desc: "Follow your issue from Submitted → Assigned → In Progress → Resolved. Every update is timestamped permanently.", bg: "bg-emerald-50", stroke: "#065f46",
    icon: <><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></> },
  { title: "Community upvoting", desc: "Citizens upvote issues they face. Higher votes push issues up the department's queue — your voice has weight.", bg: "bg-amber-50", stroke: "#b45309",
    icon: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></> },
  { title: "Public heatmap", desc: "See every open issue on a live map. Cluster view shows which areas of your city need the most attention.", bg: "bg-purple-50", stroke: "#7e22ce",
    icon: <path d="M18 20V10M12 20V4M6 20v-6"/> },
  { title: "Smart notifications", desc: "Push, SMS, and email alerts when your issue moves. Watchers on any public issue also stay informed.", bg: "bg-red-50", stroke: "#b91c1c",
    icon: <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></> },
  { title: "Civic points & badges", desc: "Earn points for reporting, voting, and rating. Ward leaderboards encourage friendly civic competition.", bg: "bg-teal-50", stroke: "#047857",
    icon: <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/> },
];

const Features = () => (
  <section className="py-24 px-6" id="features">
    <div className="max-w-6xl mx-auto">
      <span className="text-xl font-bold tracking-widest uppercase text-[#1a56db]">Platform features</span>
      <h2 className="text-4xl font-extrabold text-[#0f1923] mt-3 mb-3 tracking-tight" style={{ fontFamily: "Sora, sans-serif" }}>
        Built for accountability,<br />not just reporting
      </h2>
      <p className="text-base text-gray-500 max-w-lg leading-relaxed mb-12">
        Every feature keeps the loop closed — from the citizen's phone to the field worker's hands.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {features.map((f) => (
          <div key={f.title} className="bg-white border border-gray-200 rounded-2xl p-7 hover:shadow-md hover:-translate-y-0.5 transition-all">
            <div className={`w-12 h-12 rounded-xl ${f.bg} flex items-center justify-center mb-5`}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={f.stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {f.icon}
              </svg>
            </div>
            <h3 className="text-base font-bold text-[#0f1923] mb-2">{f.title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Features;