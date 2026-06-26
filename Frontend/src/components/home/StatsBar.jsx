const stats = [
  { num: "1200+", label: "Issues reported" },
  { num: "89%", label: "Resolution rate" },
  { num: "48+", label: "Cities onboard" },
  { num: "4.2 days", label: "Avg. to resolve" },
];

const StatsBar = () => (
  <section className="bg-[#0f1923] py-12 px-6">
    <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
      {stats.map((s) => (
        <div key={s.label} className="text-center">
          <div className="text-4xl font-extrabold text-white tracking-tight mb-1" style={{ fontFamily: "Sora, sans-serif" }}>
            {s.num}
          </div>
          <div className="text-sm text-white/50 font-medium">{s.label}</div>
        </div>
      ))}
    </div>
  </section>
);

export default StatsBar;