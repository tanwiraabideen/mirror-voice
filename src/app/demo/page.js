'use client'

import { HeroHeader } from "@/components/header";
import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";
import WaveformVisualizer from "@/components/WaveformVisualizer";
import TitleReveal from "@/components/TitleReveal";
import CircularScore from "@/components/CircularScore";
import { startRecording } from "../../../utils/recorder.js";

export default function Home() {
    const [speaking, setSpeaking] = useState(false);
    const [analysed, setAnalysed] = useState(true);
    const recorderRef = useRef(null); // to keep track of the recorder instance
    const improvements = [
        "Speak more slowly to improve clarity",
        "Reduce filler words like 'um' and 'uh'",
        "Maintain consistent volume throughout",
        "Add more pauses between sentences",
        "Vary your tone to sound more engaging"
    ];


    const handleButtonClick = async () => {
        if (!speaking) {
            // Start recording
            recorderRef.current = await startRecording();
            setSpeaking(true);
        } else {
            // Stop recording
            const audioBlob = await recorderRef.current.stop();
            setSpeaking(false);
            recorderRef.current = null;

            // Optional: download the recording
            const url = URL.createObjectURL(audioBlob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "user_audio.wav";
            document.body.appendChild(a);
            a.click();
            URL.revokeObjectURL(url);

            // TODO: send audioBlob to backend / ElevenLabs
        }
    }

    return (
        <div className="flex flex-col">
            <HeroHeader></HeroHeader>
            <div className="flex flex-col items-center mt-40 space-y-15 w-fit mx-auto">
                <TitleReveal className={"text-4xl "} text={"Your turn to talk."}></TitleReveal>
                <WaveformVisualizer isActive={speaking}></WaveformVisualizer>
                {speaking ? <Button onClick={handleButtonClick} asChild size="lg" className="rounded-xl w-fit px-5 hover:cursor-pointer text-base bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700">
                    <span className="text-nowrap">Stop Speaking</span>
                </Button> : <Button onClick={handleButtonClick} asChild size="lg" className="rounded-xl w-fit px-5 text-base hover:cursor-pointer">
                    <span className="text-nowrap">Start Speaking</span>
                </Button>}
            </div>
            <div className="rounded-2xl mx-auto mt-20 p-10 bg-slate-100 w-fit">
                {analysed ? (
                    <div className="flex flex-col items-center space-y-10">
                        <TitleReveal className={'text-4xl'} text={"Scores"}></TitleReveal>
                        <div className="flex flex-row space-x-14">
                            <div className="flex flex-col space-y-4 items-center">
                                <h1>Fluency</h1>
                                <CircularScore score={8}></CircularScore>
                            </div>
                            <div className="flex flex-col space-y-4 items-center">
                                <h1>Clarity</h1>
                                <CircularScore score={4}></CircularScore>
                            </div>
                            <div className="flex flex-col space-y-4 items-center">
                                <h1>Confidence</h1>
                                <CircularScore score={2}></CircularScore>
                            </div>
                            <div className="flex flex-col space-y-4 items-center">
                                <h1>Pacing</h1>
                                <CircularScore score={9}></CircularScore>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div>
                        <TitleReveal className={'text-4xl mb-4'} text={"Scores And Improvements"}></TitleReveal>
                        <p className="text-center text-gray-500 text-lg">Start speaking to get scores.</p>
                    </div>
                )}
            </div>
            <div className="rounded-2xl mx-auto my-10 p-10 bg-slate-100 w-fit">
                <TitleReveal className={'text-4xl'} text={"Improvements"}></TitleReveal>
                <ul className="space-y-3 pt-5">
                    {improvements.map((improvement, index) => (
                        <li key={index} className="flex items-start gap-3">
                            <span className="text-blue-500 mt-1">•</span>
                            <span>{improvement}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}