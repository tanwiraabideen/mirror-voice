import formidable from "formidable";
import fs from "fs";
import path from "path";
import axios from "axios";
import FormData from "form-data";

export const config = { api: { bodyParser: false } };
const filePath = path.join(process.cwd(), "voiceData.json");

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  // Get voiceId from local storage
  const voiceData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  const voiceId = voiceData.voiceId;
  if (!voiceId) return res.status(500).json({ error: "Voice ID not found" });

  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: "File parsing failed" });

    const file = files.audio;
    try {
      const formData = new FormData();
      formData.append("file", fs.createReadStream(file.filepath), file.originalFilename);

      const response = await axios.post(
        `https://api.elevenlabs.io/v1/voices/${voiceId}/samples`,
        formData,
        {
          headers: {
            "xi-api-key": process.env.ELEVEN_API_KEY,
            ...formData.getHeaders(),
          },
        }
      );

      res.json({ success: true, data: response.data });
    } catch (error) {
      console.error(error.response?.data || error);
      res.status(500).json({ error: "Sample upload failed" });
    }
  });
}
