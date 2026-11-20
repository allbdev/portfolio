# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two audiences on the same visit, both hiring for remote **Senior Full-stack Engineer** roles (full-time or contract, with daily overlap across EST and CET hours):

- **Recruiters and talent screeners.** They scan fast for title, stack, years, location and availability, and decide in under a minute whether to pass the profile on.
- **Hiring managers and engineering leads.** They come in to judge seniority. They read the case studies, look at how hard problems were solved, and check that the site itself shows frontend craft.

Both groups need the screening facts visible right away and depth available for anyone who wants it.

## Product Purpose

The personal portfolio and interactive CV of Vinícius Albuquerque, a senior full-stack engineer based in Vila Velha, Brazil (UTC-3). It exists to get him interviews for remote senior full-stack roles. Success means a visitor leaves sure of his seniority and reaches out by email, LinkedIn, or after downloading the CV.

## Positioning

A visitor should leave remembering four things, all true and all backed by the record:

1. **Solo founder-engineer.** He is the technical co-founder and only engineer of Path Trader, a SaaS with about 70 customers. He architected, built and runs the whole stack himself: 540 merged PRs and about 56 production deployments behind CI gates.
2. **Data-heavy product UI.** At Bird he architected the no-code dashboard builder (Malloy, SolidJS, Vega) that enterprise customers use on datasets of 1M+ records.
3. **AI-first, safely.** Claude and MCP are part of his daily tooling, and he focuses on keeping AI-written code safe to ship. The site shows this with llms.txt, Markdown twins of every case study, and a grounded chat that runs on-device when it can.
4. **Craft and range.** His work spans web, mobile (shipped to both app stores) and 3D games. The site is itself evidence of the frontend craft.

## Operating Context

- Visitors arrive from LinkedIn, the CV, recruiter outreach and job applications, often on a phone.
- Many visitors hand the site to an AI assistant. `/llms.txt` and `/md/[lang]/[slug]` exist so assistants summarise him accurately.
- Routes: `/[lang]` (one-page portfolio: home, about, projects, experience, skills, contact) and `/[lang]/projeto/[slug]` (case studies).
- Contact happens through direct links only: email, LinkedIn, GitHub, and the CV PDF.

## Capabilities and Constraints

- **Bilingual parity:** English and Brazilian Portuguese (`app/dictionaries/en.json`, `pt.json`). Every change ships in both.
- **AI-readable layer must stay intact:** llms.txt (built from the EN dictionary via `app/profile.ts`), the Markdown case-study twins, the "Ask your AI" prompt handoff, and the chat (Gemini Nano on-device, falling back to Gemini's free tier via `/api/chat`).
- **No contact form.** Direct links only.
- Interactive features already in place: 3D commit skyline (real local git history via `pnpm commits`), interactive terminal, ⌘K command palette, git-graph experience timeline, dark/light theme, case-study pages with screenshot carousels and architecture flows.
- Stack in place: Next.js 16 App Router, TypeScript, MUI v7 + Emotion, Tailwind v4, Framer Motion, three.js / React Three Fiber, deployed on Vercel.
- Language-independent facts live in `app/site.ts`. Visible copy lives in the dictionaries, which also feed llms.txt, so the two never drift apart.

## Brand Commitments

- Identity is his personal name, Vinícius Albuquerque (logo at `public/logo.svg`).
- About and Experience are written in the first person. Copy is plain and specific, and claims are backed by numbers from the CV.

## Evidence on Hand

- CV: `public/cv.pdf`, `public/cv.md` (the source of truth for roles, dates and metrics).
- Case studies for Bird dashboard builder, Path Trader, Tavi, Bem Coberto, Vestra, Dig to Japan with a Spoon, and Shave the Capybara, with screenshots in `public/projects/<slug>/`.
- Metrics on record: 6+ years, 1M+ records per dashboard, ~70 Path Trader customers, 540 PRs, ~56 deployments, 2 app stores. Commit activity comes from `app/data/commits.json`.
- **Do not fabricate:** no metrics beyond those in the CV and dictionaries, and no testimonials, client logos, press or endorsements. None exist.

## Product Principles

1. **Screen in seconds, prove in depth.** Title, stack, years and availability are legible instantly. The case studies carry the proof for engineers.
2. **Every claim is checkable.** Numbers come from the record, and live links, code or screenshots back them up wherever they exist.
3. **The site is a work sample.** Its craft, performance and accessibility are part of the argument, so a regression counts as a product bug.
4. **Readable by people and machines.** Every fact a person sees is available to an AI assistant, and in both languages.
5. **One step to contact.** Reaching him never takes more than a click.

## Accessibility & Inclusion

The site already respects `prefers-reduced-motion` in its animated components (terminal, scramble text, count-up, AI section, global CSS). That must hold for any new motion. No formal WCAG target has been set.
