# Bilal's Personal Style Guide

A visual style guide app based on **Deep Autumn** seasonal color analysis, with an AI-powered clothing analyzer that tells you whether a piece of clothing suits your palette.

## Features

- **Color Palette** — Visual swatches of all your best colors with hex codes and usage tips
- **Colors to Avoid** — Side-by-side comparisons of what to skip and what to wear instead
- **Clothing Guide** — Every garment type with wear/avoid verdicts, quantities, and recommended colors
- **Outfit Combos** — Pre-built outfit formulas with color harmony previews
- **Occasion Dressing** — What to wear for office, conferences, dinners, weekends, and formal events
- **AI Analyzer** — Upload or paste a photo of any clothing item and get an instant buy/skip recommendation

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Add your Anthropic API key

Copy `.env.example` to `.env.local` and add your API key:

```bash
cp .env.example .env.local
```

Then edit `.env.local` and replace the placeholder with your actual key from [console.anthropic.com](https://console.anthropic.com/).

### 3. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy to Vercel (Free — Get a Live URL)

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) and sign in with GitHub
3. Click **"Add New Project"** → Import your repo
4. Add your environment variable:
   - Name: `ANTHROPIC_API_KEY`
   - Value: your API key
5. Click **Deploy**

You'll get a live URL like `bilal-style-guide.vercel.app` that works on any device.

## Tech Stack

- **Next.js** — React framework with API routes
- **Anthropic Claude** — Powers the AI clothing analyzer
- **Vercel** — Recommended hosting (free tier)
