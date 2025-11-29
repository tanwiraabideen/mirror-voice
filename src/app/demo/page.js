'use client'

import { HeroHeader } from "@/components/header";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import WaveformVisualizer from "@/components/WaveformVisualizer";
import TitleReveal from "@/components/TitleReveal";

export default function Home() {
    const [speaking, setSpeaking] = useState(false);

    return (
        <div className="flex flex-col">
            <HeroHeader></HeroHeader>
            <div className="flex flex-col items-center mt-40 space-y-15 w-fit mx-auto">
                <TitleReveal className={"text-4xl "} text={"Your turn to talk."}></TitleReveal>
                <WaveformVisualizer isActive={speaking}></WaveformVisualizer>
                {speaking ? <Button onClick={() => setSpeaking(!speaking)} asChild size="lg" className="rounded-xl w-fit px-5 hover:cursor-pointer text-base bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700">
                    <span className="text-nowrap">Stop Speaking</span>
                </Button> : <Button onClick={() => setSpeaking(!speaking)} asChild size="lg" className="rounded-xl w-fit px-5 text-base hover:cursor-pointer">
                    <span className="text-nowrap">Start Speaking</span>
                </Button>}
            </div>
        </div>
    )
}