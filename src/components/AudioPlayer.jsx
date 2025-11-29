"use client";
import { useState, useEffect } from "react";

export default function AudioPlayer({ audioUrl }) {
  const [src, setSrc] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!audioUrl) return;

    async function loadAudio() {
      setLoading(true);

      try {
        const res = await fetch(audioUrl);

        if (!res.ok) {
          console.error("Audio fetch failed", res.status);
          setLoading(false);
          return;
        }

        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        setSrc(url);
      } catch (error) {
        console.error("Audio load error:", error);
      } finally {
        setLoading(false);
      }
    }

    loadAudio();

    // Cleanup URL on unmount
    return () => {
      if (src) URL.revokeObjectURL(src);
    };
  }, [audioUrl]);

  if (!audioUrl) return null;

  return (
    <div style={{ marginTop: "20px" }}>
      {loading && <p>Loading audio...</p>}

      {!loading && src && (
        <audio controls src={src} style={{ width: "100%" }}>
          Your browser does not support the audio element.
        </audio>
      )}
    </div>
  );
}
