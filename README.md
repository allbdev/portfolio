# Vinícius Albuquerque - Senior Software Engineer Portfolio

A modern, high-performance portfolio website built to showcase my work, skills, and professional experience. Designed with a focus on user experience, accessibility, and clean architecture.

## 🚀 Overview

This application serves as my interactive curriculum vitae and project showcase. It demonstrates advanced frontend capabilities, internationalization, and responsive design patterns using the latest web technologies.

## ✨ Key Features

-   **Internationalization (i18n)**: seamless support for **English** and **Portuguese** (Brazil), with automatic language detection and manual toggling.
-   **Dynamic Theming**: robust **Dark/Light mode** support that respects system preferences and persists user choices.
-   **Responsive Design**: fully adapted layouts for mobile, tablet, and desktop devices.
-   **Smooth Animations**: engaging transitions and scroll effects powered by Framer Motion.
-   **3D Commit Skyline**: the hero renders a year of real commits as a rotatable three.js skyline (drag to spin, hover a day).
-   **Interactive Terminal**: types out an intro when scrolled into view, then accepts commands (`help`, `skills`, `git log`, `sudo hire-me`, ...).
-   **Command Palette**: `⌘K` / `Ctrl+K` to jump to sections, open case studies, copy the email, toggle theme or language.
-   **llms.txt + Ask your AI**: `/llms.txt` is generated at build time from the English dictionary, and a section hands visitors a ready-made prompt (copy, or open in ChatGPT / Claude / Perplexity) that points their assistant at it. Every case study also has a Markdown twin (`/en/projeto/<slug>.md`), which llms.txt links to.
-   **AI Chat ($0)**: a floating chat (also `ask <question>` in the terminal and in `⌘K`) grounded on the llms.txt profile. It runs on **Chrome's built-in Gemini Nano** when the model is already on the visitor's machine, so nothing leaves the browser. Otherwise it calls `/api/chat` on **Gemini's free tier**. History lives in `localStorage`.
-   **Git-graph Experience**: career rendered as `git log --graph`, drawn as you scroll.
-   **Modern Architecture**: built on Next.js 16 (App Router) with server-side rendering and optimized performance.

## 🛠️ Tech Stack

-   **Framework**: Next.js 16 (App Router)
-   **Language**: TypeScript
-   **UI Library**: Material UI (MUI) v7
-   **Styling**: Emotion & CSS Modules
-   **Animations**: Framer Motion
-   **3D**: three.js + React Three Fiber
-   **Icons**: MUI Icons

## 📈 Refreshing the commit skyline

GitHub under-counts private work, so the skyline reads local git history instead:

```bash
pnpm commits          # scans ~/Dev (or pass another folder)
```

This rewrites `app/data/commits.json` (only your own author emails are counted; private repos show up as "client work"). Commit the file to publish it.

## 🤖 Enabling the AI chat

1. Create a free key at [aistudio.google.com/apikey](https://aistudio.google.com/apikey). No card is needed, so it can never bill.
2. Add it to Vercel (Project → Settings → Environment Variables) as `GEMINI_API_KEY`, then redeploy. For local dev, put it in `.env.local`.
3. Optional: set `GEMINI_MODEL` to pick another model (default `gemini-flash-lite-latest`).

Without a key, the chat button stays hidden, except for visitors whose Chrome already has Gemini Nano. When the free quota runs out, the widget offers the copy-a-prompt fallback. `/api/chat` caps message size and history and applies a best-effort per-IP rate limit.
