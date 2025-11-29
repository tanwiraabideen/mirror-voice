if (!global.audioCache) {
  global.audioCache = {};
}

import nodeFormData from "form-data";
const FormData = nodeFormData;

import fetch from "node-fetch";
import { analyzeTranscript } from "../../analysis.js";
import { improveSpeech } from "../../improveSpeech.js";
import { generateImprovedAudio } from "../../newAudio.js";

export const runtime = "nodejs";

async function wait(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

export async function POST(req) {
  const form = await req.formData();
  const file = form.get("audio");

  if (!file) {
    return new Response(JSON.stringify({ error: "No audio file" }), {
      status: 400,
    });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  const fd = new FormData();
  fd.append("model_id", "scribe_v1");
  fd.append("timestamp_granularity", "word");
  fd.append("file", buffer, {
    filename: file.name || "audio.wav",
    contentType: file.type || "audio/wav",
  });

  console.log("STT start");

  let sttRes;
  const maxAttempts = 4;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      sttRes = await fetch("https://api.elevenlabs.io/v1/speech-to-text", {
        method: "POST",
        headers: {
          "xi-api-key": process.env.ELEVENLABS_API_KEY,
          ...fd.getHeaders(),
        },
        body: fd,
        timeout: 60000,
      });

      if (sttRes.ok) {
        console.log("STT success");
        break;
      } else {
        throw new Error("STT responded with non-200");
      }
    } catch (err) {
      console.log(`STT error attempt ${attempt}:`, err.code || err.message);

      if (attempt === maxAttempts) throw err;

      console.log("Retrying STT in 5s...");
      await wait(5000);
    }
  }

  const sttText = await sttRes.text();
  let stt;

  try {
    stt = JSON.parse(sttText);
  } catch {
    return new Response(JSON.stringify({ stt_raw: sttText }), {
      status: 200,
    });
  }

  const transcript = stt.text || "";
  const words = stt.words || [];

  const analysis = await analyzeTranscript(transcript, words);
  const improved = await improveSpeech(transcript, analysis);

  const audioBuffer = await generateImprovedAudio(improved);
  const id = crypto.randomUUID();
  global.audioCache[id] = audioBuffer;
  const audioUrl = `/api/audio?id=${id}`;

  return new Response(JSON.stringify({ transcript, analysis, improved, audioUrl }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
