# A Day for Sebastian

An immersive birthday experience for Uncle Sebastian Omordia — from his nephew, Chukwuemeka.

Built with Next.js (App Router), TypeScript, Tailwind CSS 4 and Framer Motion.

## The experience

1. **The Grand Entrance** — balloons rise, confetti bursts and the title reveals itself.
2. **A Man Worth Celebrating** — an editorial portrait and reflection.
3. **Your Influence** — statements that brighten as you scroll through them.
4. **A Personal Note** — a letter in a warm, candle-lit room.
5. **A Wish for Your New Chapter** — birthday wishes beneath slow rays of light.
6. **Make a Wish** — a cake with flickering candles. Press the button to blow them out.

An optional music-box melody can be started with the button in the bottom-right corner. Nothing plays automatically.

## Editing the words

Every piece of text — names, the letter, the wishes and the final message — lives in
[`src/content/birthday.ts`](src/content/birthday.ts). Edit it there and the whole site updates.

To change the photograph, replace `public/images/sebastian.jpg` (portrait orientation works best)
and update `width`/`height` in the `portrait` entry. Set `portrait` to `null` to show an empty frame instead.

## Running locally

```bash
npm install
npm run dev
```

Checks: `npm run typecheck`, `npm run lint`, `npm run build`.

## Deploying to Vercel

Import the repository in Vercel. It detects Next.js automatically — no settings or environment variables are needed.

## Notes

- Animations respect the visitor's "reduce motion" setting.
- The previous static site that lived in this repository is preserved in `archive/cats-site/`.
