// utils/recorder.js

export async function startRecording() {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const mediaRecorder = new MediaRecorder(stream);
  let chunks = [];

  mediaRecorder.ondataavailable = e => chunks.push(e.data);
  mediaRecorder.start();

  const stop = () =>
    new Promise(resolve => {
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/wav" });
        resolve(blob);
      };
      mediaRecorder.stop();
    });

  return { stop };
}
