const items = [
  { color: "#22c55e", text: "Pothole filled — MG Road, Indore" },
  { color: "#f59e0b", text: "Drain cleaning in progress — Vijay Nagar" },
  { color: "#22c55e", text: "Street light fixed — Sadar Bazaar, Bhopal" },
  { color: "#3b82f6", text: "New report: Encroachment — Link Road, Surat" },
  { color: "#22c55e", text: "Garbage cleared — Andheri West, Mumbai" },
  { color: "#f59e0b", text: "Water issue assigned — Sector 21, Chandigarh" },
  { color: "#22c55e", text: "Park bench repaired — Lalbagh, Bangalore" },
  { color: "#3b82f6", text: "New report: Broken footpath — FC Road, Pune" },
];

const LiveTicker = () => (
  <div className="relative bg-gray-50 border-y border-gray-200 py-3.5 overflow-hidden">
    {/* Fade edges */}
    <div className="absolute left-0 top-0 h-full w-20 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none" />
    <div className="absolute right-0 top-0 h-full w-20 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none" />

    <span className="absolute left-5 top-1/2 -translate-y-1/2 z-20 text-[10px] font-bold tracking-widest uppercase text-[#1a56db] bg-gray-50 pr-3">
      Live updates
    </span>

    <div className="flex gap-12 w-max pl-36 animate-[ticker_30s_linear_infinite] hover:[animation-play-state:paused]">
      {[...items, ...items].map((item, i) => (
        <span key={i} className="flex items-center gap-2 text-sm text-gray-500 whitespace-nowrap">
          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: item.color }} />
          {item.text}
        </span>
      ))}
    </div>

    <style>{`
      @keyframes ticker {
        from { transform: translateX(0); }
        to   { transform: translateX(-50%); }
      }
    `}</style>
  </div>
);

export default LiveTicker;