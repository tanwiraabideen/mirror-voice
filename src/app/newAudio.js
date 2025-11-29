import fetch from "node-fetch";

export async function generateImprovedAudio(improvedSpeechText) {
  if (!improvedSpeechText) {
    throw new Error("No improved speech text provided.");
  }

  const apiKey = process.env.ELEVENLABS_API_KEY;
  const voiceId = process.env.ELEVENLABS_VOICE_ID || "UEKYgullGqaF0keqT8Bu";

  const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;

  const payload = {
    text: improvedSpeechText,
    model_id: "eleven_multilingual_v2",
    voice_settings: {
      stability: 0.3,
      similarity_boost: 0.85
    }
  };

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "xi-api-key": apiKey,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`ElevenLabs TTS error: ${errText}`);
  }

  const audioBuffer = Buffer.from(await res.arrayBuffer());

  return audioBuffer;
}
