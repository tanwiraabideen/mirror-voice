import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function wait(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

export async function analyzeTranscript(transcript, words) {
  const prompt = `
You are a speech coach. Analyze the transcript and timestamps, give 5 detailed improvements as strings in an array, e.g. ["Speak faster","Speak gently"... 3 more suggestions]. For the scores make sure to be very critical and harsh, so that good speeches and bad speeches have a distinctive difference in scores.

Return ONLY JSON and don't return any other text or markup or characters, only JSON plaintext.:
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

  const maxLLMAttempts = 5;

  console.log("LLM start");

  let completion;

  for (let attempt = 1; attempt <= maxLLMAttempts; attempt++) {
    try {
      completion = await groq.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.2,
        max_tokens: 500,
      });

      console.log("LLM success");
      
      let raw = completion.choices[0].message.content.trim();
      raw = raw.replace(/```json/gi, "").replace(/```/g, "").trim();

      try {
        return JSON.parse(raw);
      } catch (err) {
        console.log(`JSON parse fail attempt ${attempt}`);
      }

      break;
    } catch (err) {
      console.log(`LLM error attempt ${attempt}:`, err.code || err.message);

      if (attempt === maxLLMAttempts) throw err;

      console.log("Retrying LLM in 5s...");
      await wait(5000);
    }
  }

}