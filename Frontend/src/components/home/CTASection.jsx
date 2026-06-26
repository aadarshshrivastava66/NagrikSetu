import { Link } from "react-router-dom";

const CTASection = () => (
  <section className="relative bg-[#0f1923] py-24 px-6 overflow-hidden">
    <div className="absolute -top-16 -right-16 w-96 h-96 rounded-full bg-blue-600/20 pointer-events-none" />
    <div className="relative max-w-2xl mx-auto text-center">
      <h2 className="text-4xl font-extrabold text-white tracking-tight mb-4 leading-tight" style={{ fontFamily: "Sora, sans-serif" }}>
        Your neighbourhood deserves better.<br />Start here.
      </h2>
      <p className="text-base text-white/60 leading-relaxed mb-10">
        Join over 5 lakh citizens who've already made their city more accountable.
        It takes less than 60 seconds to file your first report.
      </p>
      <div className="flex justify-center gap-4 flex-wrap">
        <Link to="/report" className="text-base font-bold text-[#1a56db] bg-white hover:bg-blue-50 px-7 py-3.5 rounded-xl transition-all">
          Report an issue now
        </Link>
        <a href="#how-it-works" className="text-base font-semibold text-white border border-white/25 hover:bg-white/10 px-7 py-3.5 rounded-xl transition-all">
          See how it works
        </a>
      </div>
    </div>
  </section>
);

export default CTASection;