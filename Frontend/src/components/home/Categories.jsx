const cats = [
  { title: "Roads & footpaths", desc: "Potholes, encroachments, broken pavements", bg: "bg-amber-50", stroke: "#b45309", href: "/issues?cat=roads",
    icon: <><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></> },
  { title: "Water supply", desc: "Low pressure, contamination, burst pipes", bg: "bg-blue-50", stroke: "#1d4ed8", href: "/issues?cat=water",
    icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/> },
  { title: "Electricity", desc: "Street lights out, transformer faults", bg: "bg-purple-50", stroke: "#7e22ce", href: "/issues?cat=electricity",
    icon: <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/> },
  { title: "Sanitation", desc: "Garbage, drainage, public toilet issues", bg: "bg-emerald-50", stroke: "#065f46", href: "/issues?cat=sanitation",
    icon: <><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/></> },
  { title: "Parks & public spaces", desc: "Broken benches, damaged play equipment", bg: "bg-pink-50", stroke: "#9d174d", href: "/issues?cat=parks",
    icon: <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></> },
  { title: "Helpline & safety", desc: "Noise complaints, stray animals, unsafe structures", bg: "bg-teal-50", stroke: "#047857", href: "#",
    icon: <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.09 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3 1.23h3a2 2 0 0 1 2 1.72 12.05 12.05 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.09 9a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.05 12.05 0 0 0 2.81.7A2 2 0 0 1 21 16z"/> },
  { title: "Infrastructure", desc: "Bridges, retaining walls, public buildings", bg: "bg-orange-50", stroke: "#c2410c", href: "/#",
    icon: <><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></> },s
];

const Categories = () => (
  <section className="py-24 px-6 bg-gray-50" id="categories">
    <div className="max-w-6xl mx-auto">
      <span className="text-xs font-bold tracking-widest uppercase text-[#1a56db]">Issue categories</span>
      <h2 className="text-4xl font-extrabold text-[#0f1923] mt-3 mb-3 tracking-tight" style={{ fontFamily: "Sora, sans-serif" }}>
        What can you report?
      </h2>
      <p className="text-base text-gray-500 max-w-lg leading-relaxed mb-12">
        From potholes to broken parks — if it's a civic problem, this is where to raise it.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cats.map((cat) => (
          <a key={cat.title} 
            className={`group block bg-white text-center rounded-2xl p-6 border transition-all hover:shadow-lg hover:border-[#1a56db] hover:-translate-y-0.5 no-underline
              ${cat.dashed ? "border-dashed border-gray-300 bg-gray-50" : "border-gray-200"}`}>
            <div className={`w-14 h-14 rounded-2xl ${cat.bg} flex items-center justify-center mx-auto mb-3.5`}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={cat.stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {cat.icon}
              </svg>
            </div>
            <h4 className="text-sm font-bold text-[#0f1923] mb-1">{cat.title}</h4>
            <span className="text-xs text-gray-400 leading-snug">{cat.desc}</span>
          </a>
        ))}
      </div>
    </div>
  </section>
);

export default Categories;