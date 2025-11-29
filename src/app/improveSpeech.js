import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function wait(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

export async function improveSpeech(transcript, analysis) {
  const prompt = `
You are a speech rewriting assistant.

Take the user's transcript and the spoken-analysis data below.
Rewrite the transcript into a clearer, more confident, more structured version.
Maintain the same meaning and tone, but improve flow, pacing, clarity, and delivery.
Make sure it's not a lot longer.

Return ONLY the improved speech text, no JSON, no explanations.

---

Original Transcript:
${transcript}

Analysis Data:
${JSON.stringify(analysis, null, 2)}

---

Rewrite the transcript now:
`;

  const maxAttempts = 5;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const completion = await groq.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.5,
        max_tokens: 500,
      });

      const output = completion.choices[0].message.content.trim();
      return output;

    } catch (err) {
      console.log(`Speech-rewrite LLM error attempt ${attempt}:`, err.message);
      if (attempt === maxAttempts) throw err;
      console.log("Retrying rewrite in 5s...");
      await wait(5000);
    }
  }

  throw new Error("Failed to generate improved speech after multiple attempts.");
}
