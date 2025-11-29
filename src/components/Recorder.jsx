"use client";

import { useState, useRef } from "react";

export default function Recorder() {
  const [recording, setRecording] = useState(false);
  const [result, setResult] = useState(null);

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
      const blob = new Blob(chunksRef.current, { type: "audio/webm" });

      const file = new File([blob], "recording.webm", {
        type: "audio/webm",
      });

      const form = new FormData();
      form.append("audio", file);

      const res = await fetch("/api/analyze", {
        method: "POST",
        body: form,
      });

      const json = await res.json();
      setResult(json);
    };

    mediaRecorder.start();
    setRecording(true);
  }

  function stopRecording() {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  }

  return (
    <div>
      {!recording && (
        <button onClick={startRecording}>Start Recording</button>
      )}
      {recording && (
        <button onClick={stopRecording}>Stop Recording</button>
      )}

      <pre>{result ? JSON.stringify(result, null, 2) : ""}</pre>
    </div>
  );
}