import localFont from 'next/font/local';

// The fonts are self-hosted (latin subset, variable weight, SIL OFL) instead of
// going through next/font/google, so the build never depends on what Google
// Fonts answers at build time.

// Space Grotesk is loaded as a variable font (300..700) so the hero can animate
// `font-variation-settings` per letter as the pointer moves.
export const displayFont = localFont({
  src: './fonts/SpaceGrotesk-latin.woff2',
  weight: '300 700',
  display: 'swap',
  variable: '--font-display',
});

export const bodyFont = localFont({
  src: './fonts/InstrumentSans-latin.woff2',
  weight: '400 700',
  display: 'swap',
  variable: '--font-body',
});

export const monoFont = localFont({
  src: './fonts/JetBrainsMono-latin.woff2',
  weight: '100 800',
  display: 'swap',
  variable: '--font-mono',
});

export const fontFamilies = {
  display: displayFont.style.fontFamily,
  body: bodyFont.style.fontFamily,
  mono: monoFont.style.fontFamily,
};
