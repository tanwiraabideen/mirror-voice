import fs from "fs";
import path from "path";
import axios from "axios";

const filePath = path.join(process.cwd(), "voiceData.json");

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "No text provided" });

  const voiceData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  const voiceId = voiceData.voiceId;
  if (!voiceId) return res.status(500).json({ error: "Voice ID not found" });

  try {
    const response = await axios.post(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      { text, model_id: "eleven_multilingual_v2" },
      { headers: { "xi-api-key": process.env.ELEVEN_API_KEY }, responseType: "arraybuffer" }
    );

    res.setHeader("Content-Type", "audio/mpeg");
    res.send(Buffer.from(response.data));
  } catch (error) {
    console.error(error.response?.data || error);
    res.status(500).json({ error: "TTS failed" });
  }
}
