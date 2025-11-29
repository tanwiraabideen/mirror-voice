export default function WaveformVisualizer({ isActive = false }) {
    return (
        <div className="bg-slate-400/50 rounded-xl p-6 w-full h-32 flex items-center justify-center overflow-hidden">
            <div className="flex items-center gap-[2px] h-full">
                {[...Array(60)].map((_, i) => (
                    <div
                        key={i}
                        className={`w-1.5 rounded-sm transition-all duration-200 ${isActive
                            ? 'bg-gradient-to-t from-emerald-500 via-teal-400 to-cyan-300 animate-wave shadow-lg shadow-emerald-500/50'
                            : 'bg-slate-700/50 h-2'
                            }`}
                        style={{
                            animationDelay: `${i * 0.03}s`,
                            height: isActive ? undefined : '8px',
                        }}
                    />
                ))}
            </div>

            <style jsx>{`
        @keyframes wave {
          0%, 100% {
            height: 15%;
          }
          10% {
            height: 65%;
          }
          20% {
            height: 35%;
          }
          30% {
            height: 85%;
          }
          40% {
            height: 45%;
          }
          50% {
            height: 70%;
          }
          60% {
            height: 25%;
          }
          70% {
            height: 90%;
          }
          80% {
            height: 50%;
          }
          90% {
            height: 30%;
          }
        }

        .animate-wave {
          animation: wave 1.5s ease-in-out infinite;
        }
      `}</style>
        </div>
    );
}