---
name: Vinícius Albuquerque — Portfolio
description: A quiet engineer's console with one live signal, built to prove senior full-stack craft.
colors:
  signal-mint: "#34d399"
  signal-mint-ink: "#071a10"
  signal-mint-text-light: "#067a55"
  console-night: "#0a0e13"
  console-panel: "#10151c"
  console-panel-raised: "#131a22"
  console-hairline: "rgba(151, 166, 180, 0.14)"
  console-text: "#e9eef3"
  console-text-muted: "#8fa0ae"
  terminal-well: "#070a0e"
  daylight-bg: "#f2f4f6"
  daylight-panel: "#ffffff"
  daylight-panel-raised: "#e9edf1"
  daylight-hairline: "rgba(20, 32, 44, 0.13)"
  daylight-text: "#16202a"
  daylight-text-muted: "#5b6b78"
typography:
  display:
    fontFamily: "Space Grotesk, system-ui, sans-serif"
    fontSize: "clamp(48px, 5.2vw, 96px)"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Space Grotesk, system-ui, sans-serif"
    fontSize: "2.6rem"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Space Grotesk, system-ui, sans-serif"
    fontSize: "1.45rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Instrument Sans, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.65
  body-lead:
    fontFamily: "Instrument Sans, system-ui, sans-serif"
    fontSize: "1.1rem"
    fontWeight: 400
    lineHeight: 1.7
  label:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "0.72rem"
    fontWeight: 400
    letterSpacing: "0.04em"
  overline:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "0.72rem"
    fontWeight: 400
    letterSpacing: "0.14em"
rounded:
  xs: "6px"
  sm: "10px"
  md: "12px"
  lg: "14px"
  xl: "16px"
  card: "20px"
  pill: "999px"
spacing:
  unit: "8px"
  gutter-mobile: "24px"
  gutter-tablet: "40px"
  gutter-desktop: "64px"
  sidebar: "232px"
components:
  button-primary:
    backgroundColor: "{colors.signal-mint}"
    textColor: "{colors.signal-mint-ink}"
    rounded: "{rounded.md}"
    padding: "14px 30px"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.console-text}"
    rounded: "{rounded.md}"
    padding: "13px 29px"
  chip-tech:
    backgroundColor: "transparent"
    textColor: "{colors.console-text-muted}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "5px 11px"
  badge-in-development:
    backgroundColor: "transparent"
    textColor: "{colors.console-text-muted}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "6px 12px"
  card-project:
    backgroundColor: "{colors.console-panel}"
    rounded: "{rounded.card}"
  terminal:
    backgroundColor: "{colors.terminal-well}"
    textColor: "{colors.console-text}"
    rounded: "{rounded.lg}"
  nav-sidebar:
    backgroundColor: "{colors.console-night}"
    textColor: "{colors.console-text}"
    width: "{spacing.sidebar}"
---

# Design System: Vinícius Albuquerque — Portfolio

## Overview

**Creative North Star: "The Engineer's Console"**

The site reads as an instrument rather than a brochure. It is a quiet, dark workspace where a single live signal (Signal Mint) marks what is on, active, passing or clickable. The engineering vocabulary is the ornament: numbered sections, mono labels, a live status dot, a blinking terminal caret, a git-graph timeline, and a 3D skyline of real commits. Nothing is decorative for its own sake. Each motif is either evidence of work or a working tool.

Density is calm. Wide gutters, generous line height and one idea per section let recruiters scan quickly, while the engineers who dig in find detail layered into cards, case studies and interactive pieces. Dark is the native mode. Light mode, "Daylight", is a full peer with its own contrast-corrected accent text.

Interaction is precise and responsive. Surfaces are still at rest and answer the pointer crisply: a spotlight follows the cursor across cards, primary CTAs pull gently toward the pointer, and cards lift a few pixels. All motion runs on one easing curve and is suppressed under `prefers-reduced-motion`.

**Key Characteristics:**
- One accent hue and nothing else. Every emphasis is Signal Mint.
- Mono labels and two-digit indices organise the page like a console.
- Flat panels, hairline borders, and depth only on response.
- Three type voices with strict jobs: display, reading and machine.
- A single easing curve, `cubic-bezier(0.22, 1, 0.36, 1)`, for every transition.

## Colors

A near-monochrome slate field with one green signal light.

### Primary
- **Signal Mint** (`signal-mint`): the only accent. It fills primary CTAs, the live status dot, the terminal caret, the active nav bar, focus and hover borders, and the tinted glows behind lifted elements. Text on a mint fill is always **Mint Ink** (`signal-mint-ink`).
- **Deep Mint Text** (`signal-mint-text-light`): accent text in Daylight mode only. The raw mint reaches only about 1.9:1 on the light background, so small accent text such as section indices and hovered links switches to this darker green (about 4.8:1). Fills and borders keep the raw mint.

### Neutral (Console, dark mode)
- **Console Night** (`console-night`): page background, sidebar and mobile drawer.
- **Console Panel** (`console-panel`): cards and paper surfaces.
- **Raised Panel** (`console-panel-raised`): a second tonal step for nested blocks inside a panel.
- **Hairline** (`console-hairline`): every divider, card border, chip outline, and the rule that runs from each section title to the edge.
- **Console Text** (`console-text`) / **Muted Text** (`console-text-muted`): primary copy and secondary copy or metadata.
- **Terminal Well** (`terminal-well`): the terminal's background. It is darker than the page and stays dark in Daylight mode (`#0f151c` there).

### Neutral (Daylight, light mode)
- **Daylight** (`daylight-bg`), **Daylight Panel** (`daylight-panel`), **Daylight Raised** (`daylight-panel-raised`), **Daylight Hairline** (`daylight-hairline`), **Daylight Text** (`daylight-text`) / **Daylight Muted** (`daylight-text-muted`): one-to-one counterparts of the Console roles.

### Named Rules
**The One Signal Rule.** Signal Mint is the only chromatic color in the UI. A second accent, gradient or semantic color needs a deliberate decision first. It is never a default. Screenshots and project art are exempt.

**The Ink-on-Mint Rule.** Text on a mint fill is Mint Ink, never white.

**The Daylight Contrast Rule.** In light mode, accent text uses Deep Mint Text and accent fills keep the raw mint.

## Typography

**Display Font:** Space Grotesk (variable 300–700, system-ui fallback)
**Body Font:** Instrument Sans (400/500/600, system-ui fallback)
**Label/Mono Font:** JetBrains Mono (400/500, ui-monospace fallback)

**Character:** Space Grotesk's engineered geometry carries the headlines, Instrument Sans keeps long reading warm and neutral, and JetBrains Mono speaks in the machine voice: indices, chips, status lines and the terminal.

### Hierarchy
- **Display** (500, `clamp(48px, 4.6vw, 96px)` on desktop and `clamp(34px, 10.5vw, 96px)` on mobile, tight leading, -0.03em): the hero name only. Weight is animated per letter through `font-variation-settings` as the pointer moves. The letters are `aria-hidden` and the h1 carries `aria-label` with the full name; each word is `nowrap`. The job title follows as a display line (500, 1.3–1.65rem), never as a label.
- **Headline** (600, 1.9rem → 2.2rem → 2.6rem, -0.02em): section titles, paired with a mono index and a hairline rule.
- **Title** (600, 1.35–2.1rem, -0.01 to -0.02em): card and case-study titles. Featured cards use the larger end of the range.
- **Body** (400, 1rem, line height 1.65, Muted Text): descriptions. Lead paragraphs step up to 1.1rem with line height 1.7 and are capped near 520px wide.
- **Label** (400, 0.72–0.8rem, +0.04 to +0.06em): chips, status lines, section indices and metadata, always in mono. 0.72rem (11.5px) is the floor.
- **Overline** (400, 0.72rem, +0.06 to +0.14em, uppercase): row labels in a side column (case-study blocks, Stack groups, stat labels, About facts). Never as an eyebrow stacked above a heading.

### Named Rules
**The Three Voices Rule.** Display is for names and headings, Instrument Sans is for anything read as prose, and mono is for anything a machine would print: numbers, indices, tags, status, code. Never set prose in mono.

**The Index Rule.** Every top-level section opens with its two-digit mono index (`00`–`05`) in accent text.

**The No-Eyebrow Rule.** Headings carry their own weight: no kicker or eyebrow label stacked above a heading. Meta that used to sit there (project type, dates, role) goes on a mono line *below* the title.

**The Readable Floor Rule.** No text below 0.72rem (11.5px), and dim text uses a muted colour token, never opacity: opacity drops contrast below AA.

## Layout

On desktop (`lg`+), a fixed 232px sidebar holds the name, the numbered nav and the theme/language controls, and the content scrolls beside it. Below `lg`, the sidebar collapses into a translucent top bar (background at 85% opacity, blurred) with a 280px drawer.

Content gutters scale from 24px to 40px to 64px (`xs` / `sm` / `lg`). Sections are spaced generously, with roughly 80–120px of top padding. Spacing follows MUI's 8px unit and allows half and quarter steps (for example 14px or 22px) where optical alignment needs them. Reading text is capped at about 520–580px wide (near 75 characters). Project cards sit in a responsive grid: one featured card, standard cards, then a compact "Lab" strip of smaller cards.

## Elevation & Depth

The system is flat at rest. Surfaces separate through tonal steps (Night → Panel → Raised) and hairline borders. Depth appears only in response to interaction, and it is light rather than shadow: lifted elements cast an accent-tinted glow, never a grey drop shadow.

### Shadow Vocabulary
- **Card lift** (`0 24px 80px` Signal Mint at 10% alpha, plus `translateY(-6px)` and a border shifting to mint at 40%): project cards on hover.
- **CTA glow** (`0 8px 40px` Signal Mint at 45% alpha): primary button on hover.
- **Feature glow** (`0 30px 90px` mint at 12% alpha with a 1px mint ring): featured or focused panels.
- **Pulse** (`0 0 0 0 → 0 0 0 14px` in mint, fading): git-graph head and live indicators.

### Named Rules
**The Flat-By-Default Rule.** Nothing casts a shadow at rest. Depth is a reply to hover, focus or a live state.

**The Light-Not-Shadow Rule.** Elevation is always mint-tinted light, never neutral black shadow.

## Shapes

Corners are soft and graduated by scale. Small controls and toggles use 6–10px, buttons use 12px (the theme's base radius), the terminal uses 14px, inner panels use 16px, and full cards use 20px. Chips and badges are full pills. Status dots and avatars are circles. All borders are 1px hairlines. Card images clip inside the card radius and zoom slowly on hover.

## Components

### Buttons
Quiet until touched, then decisive.
- **Shape:** gently rounded (12px). Labels are sentence case at weight 600, with no uppercase.
- **Primary:** Signal Mint fill with Mint Ink text at about 0.95rem, padding about 14×30px, and a trailing 18px icon. On hover, the CTA glow appears and the fill stays the same. Hero CTAs are magnetic and pull up to 18% of the pointer offset within 110px.
- **Secondary (outlined):** a transparent button with a hairline border and primary text. On hover the border turns mint and the text switches to accent text.
- **Inline link:** 0.88rem at weight 600 in Muted Text with a trailing arrow and a 44px minimum hit height. On hover the text switches to accent text.
- **Focus:** every control shows a 2px Signal Mint outline at a 3px offset on `:focus-visible`. The Material ripple is disabled.

### Chips
- **Style:** tech-stack tags are mono 0.66rem with +0.06em tracking in Muted Text, a hairline border and a pill shape (padding about 5×11px). They are display-only, with no hover state.
- **Status badge:** the same pill form where a live link would sit. "In development" is neutral (Muted Text, hairline border, hollow dot, no blink); "Shipped" work gets a mint border, a mint tint and a solid mint dot.
- **Stack lists:** the Stack section is not chips: each group is one dot-separated line, the first four items in primary text and weight 500, the rest muted.

### Cards / Containers
- **Corner Style:** 20px (Spotlight Card).
- **Background:** Console Panel or Daylight Panel.
- **Shadow Strategy:** flat at rest, Card lift on hover (see Elevation).
- **Border:** a 1px hairline that turns mint at 40% on hover.
- **Signature behavior:** a 480px radial mint spotlight (7% alpha) follows the pointer, and screenshots inside `.shot` zoom to 1.06 over 1s.

### Navigation
- **Sidebar:** each entry is a mono index in accent text, then a 0.9rem label at weight 500. The active section grows a 22px Signal Mint bar beside its label. On mobile the sidebar becomes a blurred top bar with a drawer, and ⌘K opens the command palette from anywhere.

### Terminal (signature)
A macOS-style window in a Terminal Well with a 14px radius, a mint border at 22%, traffic-light dots and a subtle header strip. The text is mono, and a blinking block caret is drawn in Signal Mint. It types its intro once when scrolled into view and then accepts commands.

### Case-study ending (signature)
Every case study ends with a "Next case study" link (display title with an arrow that slides on hover), then a panel with the contact line, Email and Download CV, then the footer. The long description folds behind a native `<details>` toggle when a full case study exists.

### Section Heading (signature)
A mono index in accent text, a display headline, and a hairline rule that runs to the right edge. The title scrambles in once on reveal.

### Live Status Dot (signature)
An 8px Signal Mint circle with an expanding ping ring on a 1.8s cycle. It means "available / online" and nothing else.

## Do's and Don'ts

### Do:
- **Do** route every emphasis through Signal Mint, and use Deep Mint Text for small accent text in Daylight mode.
- **Do** keep surfaces flat at rest and reveal depth only as mint-tinted glow on hover, focus or a live state.
- **Do** open each top-level section with its two-digit mono index, display headline and edge-running hairline.
- **Do** use `cubic-bezier(0.22, 1, 0.36, 1)` for every transition. Reveals run 0.6–0.8s, rising 20–26px with an 0.08s stagger.
- **Do** set numbers, tags, indices and status in JetBrains Mono, and prose in Instrument Sans.
- **Do** guard every new animation with `prefers-reduced-motion`.
- **Do** design every screen in both Console (dark) and Daylight (light) modes.

### Don't:
- **Don't** introduce a second accent hue, gradient fill or semantic color palette without an explicit decision.
- **Don't** put white text on Signal Mint. Use Mint Ink.
- **Don't** use raw `#34d399` for small text on the Daylight background. It fails contrast.
- **Don't** add resting drop shadows or grey elevation.
- **Don't** set body prose in mono or uppercase button labels.
- **Don't** use the live status dot for anything except availability.
- **Don't** stack an eyebrow or kicker above a heading, or set any text below 0.72rem.
- **Don't** dim text with opacity. Use Muted Text.
- **Don't** use amber, red or any second hue for status. In-progress work is neutral.
