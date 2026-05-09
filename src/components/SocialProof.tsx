export function SocialProof() {
  return (
    <section className="py-20 border-y border-white/5 bg-white/[0.01]">
      <div className="container mx-auto px-4 md:px-6">
        <p className="text-center text-sm font-medium text-neutral-500 mb-8">
          Dirancang berdasarkan masukan praktisi handal:
        </p>
        
        <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8">
          {/* Enhanced Dummy Logos */}
          {[
            { name: "AdsMaster", icon: "square" },
            { name: "ScaleUp.id", icon: "circle" },
            { name: "GROWTH", icon: "triangle" },
            { name: "BOSSNESIA", icon: "diamond" },
            { name: "DataCrafter", icon: "bars" }
          ].map((brand, i) => (
            <div key={i} className="flex items-center gap-3 px-6 py-3 rounded-xl border border-white/5 bg-white/[0.02] grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all cursor-default backdrop-blur-sm">
              {brand.icon === "square" && <div className="w-4 h-4 rounded bg-white/40"></div>}
              {brand.icon === "circle" && <div className="w-4 h-4 rounded-full bg-white/40"></div>}
              {brand.icon === "triangle" && <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[14px] border-b-white/40"></div>}
              {brand.icon === "diamond" && <div className="w-4 h-4 rotate-45 bg-white/40"></div>}
              {brand.icon === "bars" && <div className="flex gap-0.5"><div className="w-1 h-4 bg-white/40"></div><div className="w-1 h-3 bg-white/40"></div></div>}
              <span className="font-semibold text-sm md:text-base tracking-tight text-white/40">{brand.name.toLowerCase()}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
