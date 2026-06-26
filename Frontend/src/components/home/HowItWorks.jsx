const steps = [
  { num: "1", title: "Spot the issue", desc: "Open the app, take a photo, and describe what you see. GPS pins your exact location automatically." },
  { num: "2", title: "Submit your report", desc: "Choose a category and hit submit. You get a unique ticket ID instantly." },
  { num: "3", title: "Municipality acts", desc: "Your report lands in the right department's queue. A field worker is assigned with an SLA deadline." },
  { num: "4", title: "Track & confirm", desc: "Get notified at every stage. Rate the fix once resolved. Issues that recur automatically reopen." },
];

const HowItWorks = () => (
  <section className="py-24 px-6" id="how-it-works">
    <div className="max-w-6xl mx-auto">
      <span className="text-xs font-bold tracking-widest uppercase text-[#1a56db]">How it works</span>
      <h2 className="text-4xl font-extrabold text-[#0f1923] mt-3 mb-3 tracking-tight" style={{ fontFamily: "Sora, sans-serif" }}>
        From report to resolution<br />in four steps
      </h2>
      <p className="text-base text-gray-500 max-w-lg leading-relaxed mb-14">
        No phone calls, no queues. Just take a photo, drop a pin, and your municipality gets to work.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
        {/* Connector line (desktop only) */}
        <div className="hidden lg:block absolute top-7 left-[12%] right-[12%] h-px bg-gray-200" />

        {steps.map((step) => (
          <div key={step.num} className="relative z-10">
            <div className="w-14 h-14 rounded-full bg-[#1a56db] text-white flex items-center justify-center text-xl font-extrabold mb-5 shadow-[0_0_0_6px_#e8effd]" style={{ fontFamily: "Sora, sans-serif" }}>
              {step.num}
            </div>
            <h3 className="text-base font-bold text-[#0f1923] mb-2">{step.title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;