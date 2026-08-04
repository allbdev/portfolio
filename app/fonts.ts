import { Instrument_Sans, JetBrains_Mono, Space_Grotesk } from 'next/font/google';

// Space Grotesk is loaded as a variable font (300..700) so the hero can animate
// `font-variation-settings` per letter as the pointer moves.
export const displayFont = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
});

export const bodyFont = Instrument_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
  variable: '--font-body',
});

export const monoFont = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--font-mono',
});

export const fontFamilies = {
  display: displayFont.style.fontFamily,
  body: bodyFont.style.fontFamily,
  mono: monoFont.style.fontFamily,
};
