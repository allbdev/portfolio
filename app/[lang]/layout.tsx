import '../globals.css';
import type { Metadata } from 'next';
import { bodyFont, displayFont, monoFont } from '../fonts';
import ThemeRegistry from '../components/ThemeRegistry/ThemeRegistry';
import { i18n, isValidLocale } from '../../i18n-config';
import { Analytics } from '@vercel/analytics/next';
import { site } from '../site';

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: `${site.firstName} ${site.lastName} · Senior Full-stack Engineer`,
  description:
    'Senior full-stack engineer with 6+ years shipping web and mobile products: React, Next.js and TypeScript on the front, Node.js, NestJS and Go on the back. Built a no-code analytics dashboard builder for enterprise datasets of 1M+ records and is the technical co-founder and only engineer of Path Trader, a SaaS with about 70 customers.',
  twitter: { card: 'summary_large_image' },
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
      lang={isValidLocale(lang) ? lang : i18n.defaultLocale}
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
        <Analytics />
      </body>
    </html>
  );
}
