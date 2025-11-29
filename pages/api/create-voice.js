import fs from "fs";
import path from "path";
import axios from "axios";

const filePath = path.join(process.cwd(), "voiceData.json");

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  // Check if voiceId exists locally
  let voiceData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  if (voiceData.voiceId) {
    return res.json({ success: true, voiceId: voiceData.voiceId });
  }

  // If not, create new voice
  try {
    const response = await axios.post(
      "https://api.elevenlabs.io/v1/voices",
      { name: "UserCloneVoice", description: "Automatically created voice" },
      {
        headers: {
          "xi-api-key": process.env.ELEVEN_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    const voiceId = response.data.id;
    // Save locally
    fs.writeFileSync(filePath, JSON.stringify({ voiceId }, null, 2));

    res.json({ success: true, voiceId });
  } catch (error) {
    console.error(error.response?.data || error);
    res.status(500).json({ error: "Voice creation failed" });
  }
}
