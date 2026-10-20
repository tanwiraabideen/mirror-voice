# Mirror Voice

A Next.js app with voice capabilities and a built-in audio player, powered by [Groq](https://groq.com) and [Hugging Face Inference](https://huggingface.co/docs/inference-providers).

## Tech stack

- Next.js 16 / React 19
- Tailwind CSS 4, Radix UI, Motion
- Groq SDK and Hugging Face Inference

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env.local` file in the project root with your Groq and Hugging Face API keys.

3. Start the dev server:

   ```bash
   npm run dev
   ```

   Then open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command         | Description              |
| --------------- | ------------------------ |
| `npm run dev`   | Start the dev server     |
| `npm run build` | Build for production     |
| `npm run start` | Run the production build |
