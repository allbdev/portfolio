# Vinícius Albuquerque

**Senior Full-stack Engineer**

[vini.alb13@gmail.com](mailto:vini.alb13@gmail.com) · [linkedin.com/in/albuquerque-vinicius](https://linkedin.com/in/albuquerque-vinicius) · [github.com/allbdev](https://github.com/allbdev) · [vinicius-albuquerque.com.br](https://www.vinicius-albuquerque.com.br/) · Vila Velha, Brazil (UTC-3, remote)

6+ years end to end · React, Next.js, TypeScript · Node.js, NestJS, Go · PostgreSQL, Docker, AWS · AI-first workflow

## Summary

Senior full-stack engineer with 6+ years taking features from database to UI for an Amsterdam-based communications platform and for Brazilian product teams. Built Bird's no-code analytics dashboard builder, used by enterprise customers on 1M+ record datasets. Technical co-founder and only engineer of Path Trader, a SaaS now serving about 70 customers. Works AI-first with Claude and MCP, with a focus on keeping AI-written code safe to ship.

## Skills

- **Frontend:** React, Next.js, TypeScript, SolidJS, TanStack Query, TanStack Table, Tailwind CSS, Radix UI
- **Backend:** Node.js, NestJS, Go, PHP (Laravel), REST APIs, WebSockets, Socket.io, PusherJS
- **Data and visualization:** PostgreSQL, Redis, Prisma, Malloy, Vega, Recharts, Chart.js
- **Mobile:** React Native, Expo, NativeWind, App Store and Google Play releases
- **Testing:** Vitest, Jest, React Testing Library, Playwright, Cypress
- **Platform and tools:** Docker, AWS, Vercel, Fly, GitHub Actions, Bitbucket Pipelines, Sentry, Datadog, Asaas, Turborepo, pnpm, Claude, OpenAI API, MCP

## Experience

### Technical Co-Founder · Path Trader · Remote

Jan 2026 - Present

Self-funded SaaS for Brazilian traders: trade journaling, analytics, an AI assistant and a partner program. Co-founded with a partner who brought the idea and runs marketing; owns the whole technology side.

- Grew to about 70 customers on a platform architected, built and run as the only engineer.
- Built the full stack on a Turborepo monorepo: Next.js and React frontend, NestJS API, Prisma on PostgreSQL, background jobs, Asaas payments, email on AWS SES.
- Merged 540 pull requests and shipped about 56 production deployments, each gated by GitHub Actions running type checks, unit and end-to-end tests.
- Built an in-product AI assistant on OpenAI GPT-5 mini over each trader's own journal and analytics.
- Runs production observability with Sentry, connected to Claude through MCP for error triage.

### Frontend Engineer · Bird · Remote (HQ Amsterdam)

Apr 2024 - Jun 2026

Cloud communications platform. Worked across analytics, marketing cloud, sales and the public website, plus Go endpoints.

- Architected a no-code dashboard builder with Malloy, SolidJS and Vega: users compose queries field by field and render them as charts, tables or KPIs, with drag-and-drop layout.
- Kept dashboards interactive on enterprise datasets of 1M+ records, used in production by enterprise customers, with TanStack Query as the server-state layer.
- Built the sales suite end to end (lead boards, lead configuration, opportunities and deals) and the Go API endpoints carrying its business logic.
- Designed a custom objects system for user-defined attributes, with a dynamic form layer of masked, format-aware inputs.
- Core contributor to the marketing cloud redesign: rebuilt about 20 pages on a Radix UI and Tailwind CSS component system.
- Made the docs answerable by AI assistants and easier to index (Markdown mirrors, llms-full.txt, structured content) with the new bird.com launch.
- Shipped all new code dark behind organization-scoped feature flags with gradual rollout, covered by Vitest, React Testing Library and Playwright.

### Senior Software Engineer · MULTTI · Remote

Jan 2022 - Mar 2024

Software outsourcing company. Technical leadership role across React, React Native and PHP (Laravel).

- Saved an at-risk client account by reorganizing a team that kept missing deadlines: led daily stand-ups, tracked each developer's progress and helped define requirements and scope, back to on-time delivery within about 3 months.
- Mentored junior engineers and improved the team's agile workflow and code review.
- Architected a real-time chat for about 100 concurrent participants and 1K+ messages using React, PusherJS, WebSockets and virtualized lists.
- Led end-to-end development of a React Native (Expo) delivery-tracking app with live maps and push notifications.
- Built a React and MUI lead management system and a financial-market streaming platform.
- Replaced manual deploys with automated pipelines by introducing Docker, AWS and Bitbucket Pipelines.
- Owned mobile releases, with automated deployments to Google Play and the App Store.

### Software Engineer · Solution4apps · Brasília, hybrid

Jan 2020 - Jan 2022

Software outsourcing company. Owned delivery of web and mobile projects from discovery to production.

- Built a React Native (Expo) app with interactive maps, real-time camera processing, push notifications and NativeWind.
- Developed a responsive real-time financial markets platform using Next.js, Socket.io, Chakra UI and React Spring.
- Delivered an accessible public-sector web application using Next.js and Tailwind CSS.
- Configured infrastructure and ran App Store and Google Play releases.

## Projects

- **Tavi** · [oitavi.com.br](https://www.oitavi.com.br/). AI-first personal assistant for daily routines (training, chores, diet, weight, work goals): the user logs by talking to it, in the app or from Claude and ChatGPT through its MCP server. Offline-first React Native app synced with PowerSync, NestJS API with its own OAuth for MCP and a Claude-powered assistant checked by an eval suite, deployed to AWS with CDK. Expo, React Native, NestJS, Drizzle, PostgreSQL, PowerSync, Claude API, MCP, Next.js, AWS CDK.
- **Bem Coberto** · Travel insurance marketplace for Brazil, in development. Designed the architecture: one adapter per insurer behind a shared provider interface, an outbox and worker for every side effect after payment, integer-cents money and field-level encryption of personal data. Next.js, NestJS on Fastify, Prisma, PostgreSQL, Zod, Vitest, Playwright, Turborepo.
- **Vestra** · [vestra-financas.com.br](https://vestra-financas.com.br) · [github.com/allbdev/vestra-v2](https://github.com/allbdev/vestra-v2). Mobile-first personal finance PWA with multi-user workspaces and recurring transactions. Turborepo, NestJS, Next.js, Vite, React.

## Education and languages


Bachelor's Degree in Information Systems (in progress), Universidade Vila Velha (UVV), expected Jun 2028
Portuguese (native), English (fluent)
