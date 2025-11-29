export default function Metrics({ fillerWordCount = 0, tone = "Neutral" }) {
    // Determine color based on filler word count
    const getFillerColor = (count) => {
        if (count === 0) return "text-green-600 bg-green-50 border-green-200";
        if (count <= 3) return "text-yellow-600 bg-yellow-50 border-yellow-200";
        if (count <= 6) return "text-orange-600 bg-orange-50 border-orange-200";
        return "text-red-600 bg-red-50 border-red-200";
    };

    const fillerColor = getFillerColor(fillerWordCount);

    return (
        <div className="p-8 w-fit mx-auto mt-20 mb-10 bg-white rounded-2xl shadow-sm border border-gray-200">
            <h2 className="text-2xl font-bold mb-6 text-slate-800">Speech Metrics</h2>
            <div className="flex flex-row gap-6">
                {/* Filler Words Section */}
                <div className={`w-80 p-6 rounded-xl border-2 ${fillerColor} transition-all duration-300`}>
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold uppercase tracking-wide opacity-80">
                            Number of Pauses
                        </h3>
                        <span className="text-2xl">🗣️</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-bold">{fillerWordCount}</span>
                        <span className="text-lg opacity-60">detected</span>
                    </div>
                    <p className="mt-3 text-sm opacity-70">
                        {fillerWordCount === 0 && "Perfect! No pauses detected."}
                        {fillerWordCount > 0 && fillerWordCount <= 6 && "Great job! Minimal pauses."}
                        {fillerWordCount > 6 && fillerWordCount <= 25 && "Try to reduce the number of pauses."}
                        {fillerWordCount > 25 && "Focus on eliminating pauses."}
                    </p>
                </div>
                {/* Tone Section */}
                <div className="w-80 p-6 rounded-xl border-2 text-slate-600 bg-slate-50 border-slate-200 transition-all duration-300">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold uppercase tracking-wide opacity-80">
                            Tone
                        </h3>
                        <span className="text-2xl">💬</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-2xl font-bold capitalize">{tone}</span>
                    </div>
                    <p className="mt-3 text-sm opacity-70">
                        Your overall speaking tone
                    </p>
                </div>
            </div>
        </div>
    );
}