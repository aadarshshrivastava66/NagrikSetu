const testimonials = [
  { quote: "I reported a pothole that had been there for two years. Three days after submitting on NagarSeva with 60+ upvotes, the road crew showed up and filled it.", name: "Rahul Verma", ward: "Ward 12, Indore", initials: "RV", color: "#4f46e5" },
  { quote: "The drainage outside my building was overflowing every monsoon for four seasons. It got acknowledged in 6 hours and cleared in 2 days. Finally.", name: "Priya Sharma", ward: "Ward 7, Bhopal", initials: "PS", color: "#0f766e" },
  { quote: "As a ward councillor, NagarSeva transformed how my team works. The dashboard shows exactly what's pending, who's responsible, and our SLA status.", name: "Amit Kumar", ward: "Ward Councillor, Pune", initials: "AK", color: "#b45309" },
];

const Stars = () => (
  <div className="flex gap-0.5 mb-4">
    {[...Array(5)].map((_, i) => (
      <svg key={i} width="15" height="15" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="1">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ))}
  </div>
);

const Testimonials = () => (
  <section className="py-24 px-6 bg-gray-50">
    <div className="max-w-6xl mx-auto">
      <span className="text-xs font-bold tracking-widest uppercase text-[#1a56db]">Citizen stories</span>
      <h2 className="text-4xl font-extrabold text-[#0f1923] mt-3 mb-3 tracking-tight" style={{ fontFamily: "Sora, sans-serif" }}>
        Real people, real fixes
      </h2>
      <p className="text-base text-gray-500 max-w-lg leading-relaxed mb-12">
        Thousands of citizens have already used NagarSeva to get their neighbourhood issues resolved.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {testimonials.map((t) => (
          <div key={t.name} className="bg-white border border-gray-200 rounded-2xl p-7">
            <Stars />
            <blockquote className="text-sm text-gray-500 leading-relaxed mb-5 not-italic">"{t.quote}"</blockquote>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ background: t.color }}>
                {t.initials}
              </div>
              <div>
                <p className="text-sm font-semibold text-[#0f1923]">{t.name}</p>
                <p className="text-xs text-gray-400">{t.ward}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Testimonials;