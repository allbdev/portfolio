import '../globals.css';
import type { Metadata } from 'next';
import { bodyFont, displayFont, monoFont } from '../fonts';
import ThemeRegistry from '../components/ThemeRegistry/ThemeRegistry';
import { i18n } from '../../i18n-config';

export const metadata: Metadata = {
  title: 'Vinícius Albuquerque — Senior Software Engineer',
  description:
    'Senior Software Engineer with 6+ years of experience specializing in high-performance web and mobile applications using Next.js, React, TypeScript, Node.js, and Go.',
};

// Resolves the colour mode before first paint so the page never flashes the
// wrong background. Kept in sync with ThemeRegistry's storage key.
const colorModeScript = `
(function(){
  try {
    var stored = localStorage.getItem('portfolio-color-mode');
    if (stored !== 'light' && stored !== 'dark') {
      stored = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }
    document.documentElement.dataset.mode = stored;
  } catch (e) {
    document.documentElement.dataset.mode = 'dark';
  }
})();
`;

export async function generateStaticParams() {
  return i18n.locales.map((lang) => ({ lang }));
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  return (
    <html
      lang={lang || i18n.defaultLocale}
      className={`${bodyFont.variable} ${displayFont.variable} ${monoFont.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: colorModeScript }} />
      </head>
      <body className={bodyFont.className}>
        {/* Lives in the layout so the chosen colour mode survives navigation
            between the home page and the case-study pages. */}
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  );
}
