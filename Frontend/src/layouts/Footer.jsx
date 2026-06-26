import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="bg-[#0b1320] pt-16 pb-8 px-6">
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

        {/* Brand */}
        <div className="md:col-span-1">
          <Link to="/" className="flex items-center gap-2.5 mb-4">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                <circle cx="12" cy="9" r="2.5"/>
              </svg>
            </div>
            <span className="font-bold text-lg text-white" style={{ fontFamily: "Sora, sans-serif" }}>
              Nagar<span className="text-blue-300">Seva</span>
            </span>
          </Link>
          <p className="text-sm text-white/40 leading-relaxed mb-5 max-w-[220px]">
            A crowdsourced civic platform connecting citizens with their municipal authorities.
          </p>
          <div className="flex gap-2.5">
            {["Twitter", "Facebook", "Instagram"].map((s) => (
              <a key={s} href="#" aria-label={s}
                className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center text-white/40 hover:text-white/80 hover:border-white/25 transition-all">
                <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              </a>
            ))}
          </div>
        </div>

        {/* Links */}
        {[
          {
            title: "Platform",
            links: [["Report an issue", "/report"], ["Browse issues", "/issues"], ["Live map", "/map"], ["Leaderboard", "/leaderboard"], ["My reports", "/dashboard"]],
          },
          {
            title: "For Authorities",
            links: [["Government login", "/gov/login"], ["Department dashboard", "/gov/dashboard"], ["SLA management", "/gov/sla"], ["Analytics", "/gov/analytics"], ["Onboard your city", "/gov/onboard"]],
          },
          {
            title: "Resources",
            links: [["Help centre", "/help"], ["API docs", "#"], ["Open data portal", "#"], ["Privacy policy", "/privacy"], ["Terms of service", "/terms"]],
          },
        ].map((col) => (
          <div key={col.title}>
            <h5 className="text-[11px] font-bold tracking-widest uppercase text-white/30 mb-4">{col.title}</h5>
            <ul className="flex flex-col gap-2.5">
              {col.links.map(([label, href]) => (
                <li key={label}>
                  <Link to={href} className="text-sm text-white/50 hover:text-white/90 transition-colors no-underline">{label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/[0.07] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs text-white/25">© {new Date().getFullYear()} NagarSeva. Built By Aadarsh Shrivastava</p>
        <p className="text-xs text-white/30 flex items-center gap-1.5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
          Compliant with Digital India guidelines
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;