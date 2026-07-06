import { Link } from "react-router-dom";

const TEAM_VALUES = [
  {
    title: "Transparency",
    desc: "Every issue's status is public and timestamped. No silent closures, no hidden decisions.",
    icon: "🔍",
    bg: "bg-blue-50",
  },
  {
    title: "Accountability",
    desc: "Departments are measured on resolution time and citizen satisfaction — publicly visible.",
    icon: "⚖️",
    bg: "bg-green-50",
  },
  {
    title: "Accessibility",
    desc: "No login required to browse or view issues. Reporting takes less than 60 seconds.",
    icon: "🤝",
    bg: "bg-amber-50",
  },
  {
    title: "Community-driven",
    desc: "Upvotes surface what matters most to citizens, helping departments prioritize effectively.",
    icon: "🏘️",
    bg: "bg-purple-50",
  },
];

const HOW_IT_WORKS = [
  { step: "1", title: "Spot an issue", desc: "Notice a pothole, broken light, or overflowing drain in your area." },
  { step: "2", title: "Report it", desc: "Take a photo, share your location, and submit in under a minute." },
  { step: "3", title: "Track progress", desc: "Follow the issue from Submitted to Resolved with live status updates." },
  { step: "4", title: "See it fixed", desc: "Get notified when it's resolved, and rate the outcome." },
];

const STATS = [
  { value: "15+", label: "Issues Tracked" },
  { value: "2", label: "Cities Onboard" },
  { value: "6", label: "Departments" },
  { value: "24/7", label: "Reporting Access" },
];

function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero */}
      <div className="bg-[#0f1923] px-6 py-20 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-blue-600/20 pointer-events-none" />
        <div className="absolute -bottom-24 -left-12 w-72 h-72 rounded-full bg-blue-800/20 pointer-events-none" />

        <div className="max-w-3xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 bg-white/10 text-blue-200 text-xs font-semibold tracking-wider uppercase px-3 py-1.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
            About NagarSeva
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-5" style={{ fontFamily: "Sora, sans-serif" }}>
            Making civic issues<br />everyone's business
          </h1>
          <p className="text-base text-white/60 leading-relaxed max-w-xl mx-auto">
            NagarSeva bridges the gap between citizens and municipal authorities —
            turning silent frustration into tracked, resolved action.
          </p>
        </div>
      </div>

      {/* Stats strip */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl font-extrabold text-[#1a56db]" style={{ fontFamily: "Sora, sans-serif" }}>
                {s.value}
              </div>
              <div className="text-xs text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Mission */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-14">
          <span className="text-xs font-bold tracking-widest uppercase text-[#1a56db]">Our Mission</span>
          <h2 className="text-3xl font-extrabold text-[#0f1923] mt-3 mb-4" style={{ fontFamily: "Sora, sans-serif" }}>
            A city works better when everyone can see what's broken — and what's being fixed
          </h2>
          <p className="text-gray-500 leading-relaxed max-w-2xl mx-auto">
            Too often, civic complaints disappear into phone calls no one tracks and emails no one answers.
            NagarSeva replaces that with a simple, transparent system: report an issue, watch it move through
            real stages, and see it resolved — all without needing anyone's phone number.
          </p>
        </div>

        {/* Values grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {TEAM_VALUES.map((val) => (
            <div key={val.title} className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className={`w-12 h-12 rounded-xl ${val.bg} flex items-center justify-center text-2xl mb-4`}>
                {val.icon}
              </div>
              <h3 className="text-base font-bold text-[#0f1923] mb-2">{val.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{val.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className="bg-white border-y border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <span className="text-xs font-bold tracking-widest uppercase text-[#1a56db]">The Process</span>
            <h2 className="text-3xl font-extrabold text-[#0f1923] mt-3" style={{ fontFamily: "Sora, sans-serif" }}>
              How NagarSeva works
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            <div className="hidden lg:block absolute top-7 left-[12%] right-[12%] h-px bg-gray-200" />
            {HOW_IT_WORKS.map((item) => (
              <div key={item.step} className="relative z-10 text-center">
                <div
                  className="w-14 h-14 rounded-full bg-[#1a56db] text-white flex items-center justify-center text-xl font-extrabold mx-auto mb-4 shadow-[0_0_0_6px_#e8effd]"
                  style={{ fontFamily: "Sora, sans-serif" }}
                >
                  {item.step}
                </div>
                <h3 className="text-sm font-bold text-[#0f1923] mb-2">{item.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Who it's for */}
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div className="bg-white rounded-2xl border border-gray-200 p-8">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-2xl mb-5">
              🧑‍🤝‍🧑
            </div>
            <h3 className="text-lg font-bold text-[#0f1923] mb-3">For Citizens</h3>
            <ul className="space-y-2.5">
              {[
                "Report issues with photo & GPS in under a minute",
                "No login required to browse or upvote issues",
                "Track every stage until resolution",
                "Rate the outcome once resolved",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0f766e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-8">
            <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-2xl mb-5">
              🏛️
            </div>
            <h3 className="text-lg font-bold text-[#0f1923] mb-3">For Government Departments</h3>
            <ul className="space-y-2.5">
              {[
                "See only the issues in your department & city",
                "Update status with a single click",
                "Track performance with live stats",
                "Admins get a city-wide overview across departments",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7e22ce" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-[#0f1923] px-6 py-16 relative overflow-hidden">
        <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-blue-600/20 pointer-events-none" />
        <div className="max-w-2xl mx-auto text-center relative">
          <h2 className="text-3xl font-extrabold text-white mb-4" style={{ fontFamily: "Sora, sans-serif" }}>
            Ready to make your city better?
          </h2>
          <p className="text-white/60 mb-8">
            Report your first issue in less than 60 seconds — no account needed to browse.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link
              to="/report"
              className="px-7 py-3.5 rounded-xl bg-white text-[#1a56db] text-sm font-bold hover:bg-blue-50 transition-all"
            >
              Report an Issue
            </Link>
            <Link
              to="/issues"
              className="px-7 py-3.5 rounded-xl border border-white/25 text-white text-sm font-semibold hover:bg-white/10 transition-all"
            >
              Browse Issues
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;