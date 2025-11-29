import AudioPlayer from './AudioPlayer';
import Voice from '@/lib/voice';
export default function ImprovedSpeechCard({ audioUrl, transcript }) {
    return (
        <div className="p-8 w-200 mx-auto my-10 bg-white rounded-2xl shadow-sm border border-gray-200">
            <h2 className="text-2xl font-bold mb-6 text-slate-800">Improved Version</h2>

            <div className="space-y-6">
                {/* Audio Player Section */}
                <div className="p-6 bg-slate-50 rounded-xl border border-slate-200">
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-600 mb-4">
                        Audio
                    </h3>
                    <AudioPlayer audioUrl={audioUrl} />
                    <AudioPlayer audioUrl={Voice.speak} />
                </div>

                {/* Transcript Section */}
                <div className="p-6 bg-slate-50 rounded-xl border border-slate-200">
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-600 mb-4">
                        Transcript
                    </h3>
                    <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                        {transcript}
                    </p>
                </div>
            </div>
        </div>
    );
}