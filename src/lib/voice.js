// lib/voice.js

const Voice = {
  async createVoice(name = "UserVoice") {
    const res = await fetch("/api/create-voice", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    return await res.json(); // { success: true, voiceId: "xxx" }
  },

  async addSample(file) {
    const formData = new FormData();
    formData.append("audio", file);

    const res = await fetch("/api/add-sample", {
      method: "POST",
      body: formData,
    });

    return await res.json(); // { success: true }
  },

  async speak(text) {
    const res = await fetch("/api/speak", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    // converts backend audio into a playable URL
    const blob = await res.blob();
    return URL.createObjectURL(blob);
  },
};

export default Voice;
