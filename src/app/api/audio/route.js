export const runtime = "nodejs";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id || !global.audioCache[id]) {
    return new Response("Audio not found", { status: 404 });
  }

  const audio = global.audioCache[id];

  // Optional: delete after serving to free memory
  delete global.audioCache[id];

  return new Response(audio, {
    status: 200,
    headers: {
      "Content-Type": "audio/mpeg",
      "Cache-Control": "no-store"
    }
  });
}