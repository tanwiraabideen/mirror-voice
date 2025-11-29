'use client'

import { HeroHeader } from "@/components/header";
import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";
import WaveformVisualizer from "@/components/WaveformVisualizer";
import TitleReveal from "@/components/TitleReveal";
import CircularScore from "@/components/CircularScore";
import { startRecording } from "../../../utils/recorder.js";
import Recorder from "@/components/Recorder.jsx";
import Metrics from "@/components/Metrics.jsx";
import AudioPlayer from "@/components/AudioPlayer.jsx";
import ImprovedSpeechCard from "@/components/ImprovedSpeechCard.jsx";

export default function Home() {
    const [speaking, setSpeaking] = useState(false);
    const [analysed, setAnalysed] = useState(true);
    const recorderRef = useRef(null);
    const [recording, setRecording] = useState(false);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const improvements = [
        "Work on varying your pitch to make your speech more engaging.",
        "Practice pausing at key points to emphasize important information.",]
    const mediaRecorderRef = useRef(null);
    const chunksRef = useRef([]);

    async function startRecording() {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

        const mediaRecorder = new MediaRecorder(stream, {
            mimeType: "audio/webm",
        });

        mediaRecorderRef.current = mediaRecorder;
        chunksRef.current = [];

        mediaRecorder.ondataavailable = (e) => {
            chunksRef.current.push(e.data);
        };

        mediaRecorder.onstop = async () => {
            setLoading(true); // Start loading

            const blob = new Blob(chunksRef.current, { type: "audio/webm" });

            const file = new File([blob], "recording.webm", {
                type: "audio/webm",
            });

            const form = new FormData();
            form.append("audio", file);

            try {
                const res = await fetch("/api/analyze", {
                    method: "POST",
                    body: form,
                });

                const json = await res.json();
                setResult(json);
            } catch (error) {
                console.error("Error analyzing audio:", error);
            } finally {
                setLoading(false); // End loading
            }
        };

        mediaRecorder.start();
        setRecording(true);
    }

    function stopRecording() {
        mediaRecorderRef.current?.stop();
        setRecording(false);
    }

    return (
        <div className="flex flex-col">
            <HeroHeader></HeroHeader>
            <div className="flex flex-col items-center mt-40 space-y-15 w-fit mx-auto">
                <TitleReveal className={"text-4xl "} text={"Your turn to talk."}></TitleReveal>
                <WaveformVisualizer isActive={recording}></WaveformVisualizer>
                {recording ? <Button onClick={stopRecording} asChild size="lg" className="rounded-xl w-fit px-5 hover:cursor-pointer text-base bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700">
                    <span className="text-nowrap">Stop Speaking</span>
                </Button> : <Button onClick={startRecording} asChild size="lg" className="rounded-xl w-fit px-5 text-base hover:cursor-pointer">
                    <span className="text-nowrap">Start Speaking</span>
                </Button>}

                {/* Loading State */}
                {loading && (
                    <div className="flex flex-col items-center gap-4 mt-8 w-full max-w-md">
                        <p className="text-lg font-semibold text-slate-700">Analyzing your speech...</p>
                        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full animate-pulse">
                                <div className="h-full w-full bg-gradient-to-r from-blue-500 to-cyan-400 animate-loading-bar"></div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {!loading && (
                <>
                    <div className="rounded-2xl mx-auto mt-20 p-10 bg-slate-100 w-fit">
                        {result ? (
                            <div className="flex flex-col items-center space-y-10">
                                <TitleReveal className={'text-4xl'} text={"Scores"}></TitleReveal>
                                <div className="flex flex-row space-x-14">
                                    <div className="flex flex-col space-y-4 items-center">
                                        <h1>Fluency</h1>
                                        <CircularScore score={result.analysis.fluency}></CircularScore>
                                    </div>
                                    <div className="flex flex-col space-y-4 items-center">
                                        <h1>Clarity</h1>
                                        <CircularScore score={result.analysis.clarity}></CircularScore>
                                    </div>
                                    <div className="flex flex-col space-y-4 items-center">
                                        <h1>Confidence</h1>
                                        <CircularScore score={result.analysis.confidence}></CircularScore>
                                    </div>
                                    <div className="flex flex-col space-y-4 items-center">
                                        <h1>Pacing</h1>
                                        <CircularScore score={result.analysis.pacing}></CircularScore>
                                    </div>
                                    <div className="flex flex-col space-y-4 items-center">
                                        <h1>Structure</h1>
                                        <CircularScore score={result.analysis.structure}></CircularScore>
                                    </div>
                                </div>
                                <div className="flex flex-col space-y-4 items-center">
                                    <h1 className="font-semibold text-2xl">Overall Score</h1>
                                    <CircularScore size={200} score={result.analysis.overall_rating}></CircularScore>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <TitleReveal className={'text-4xl mb-4'} text={"Scores And Improvements"}></TitleReveal>
                                <p className="text-center text-gray-500 text-lg">Start speaking to get scores.</p>
                            </div>
                        )}
                    </div>

                    {result && result.analysis && result.analysis.improvements && Array.isArray(result.analysis.improvements) && (
                        <Metrics
                            fillerWordCount={result.analysis.pauses?.length || 0}
                            tone={result.analysis.tone}
                        ></Metrics>
                    )}

                    {result && result.improved && (
                        <ImprovedSpeechCard audioUrl={result.audioUrl} transcript={result.improved}></ImprovedSpeechCard>
                    )}

                    {result && result.analysis && (
                        <div className="rounded-2xl mx-auto my-10 p-10 bg-slate-100 w-fit">
                            <TitleReveal className={'text-4xl'} text={"Improvements"}></TitleReveal>
                            {result.analysis.improvements && Array.isArray(result.analysis.improvements) && result.analysis.improvements.length > 0 ? (
                                <ul className="space-y-3 pt-5">
                                    {result.analysis.improvements.map((improvement, index) => (
                                        <li key={index} className="flex items-start gap-3">
                                            <span className="text-blue-500 mt-1">•</span>
                                            <span>{typeof improvement === 'string' ? improvement : improvement?.text || ''}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-center text-gray-500 text-lg pt-5">No improvements needed!</p>
                            )}
                        </div>
                    )}
                </>
            )}

            <style jsx>{`
                @keyframes loading-bar {
                    0% {
                        transform: translateX(-100%);
                    }
                    100% {
                        transform: translateX(400%);
                    }
                }
                
                .animate-loading-bar {
                    animation: loading-bar 1.5s ease-in-out infinite;
                }
            `}</style>
        </div>
    )
}