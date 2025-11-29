import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function wait(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

export async function analyzeTranscript(transcript, words) {
  const prompt = `
You are a speech coach. Analyze the transcript and timestamps, give 5 detailed improvements.

Return ONLY JSON:
{
  "fluency": number,
  "clarity": number,
  "confidence": number,
  "pacing": number,
  "structure": number,
  "tone": "string",
  "filler_words": [],
  "pauses": [],
  "summary": "string",
  "improvements": [],
  "overall_rating": number
}

Transcript:
${transcript}

Timestamps:
${JSON.stringify(words)}
`;

  console.log("LLM start");

  let completion;
  const maxAttempts = 4;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      completion = await groq.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.2,
        max_tokens: 500,
      });

      console.log("LLM success");
      break;
    } catch (err) {
      console.log(`LLM error attempt ${attempt}:`, err.code || err.message);

      if (attempt === maxAttempts) throw err;

      console.log("Retrying LLM in 5s...");
      await wait(5000);
    }
  }

  let raw = completion.choices[0].message.content.trim();
  raw = raw.replace(/```json/gi, "").replace(/```/g, "").trim();

  return JSON.parse(raw);
}