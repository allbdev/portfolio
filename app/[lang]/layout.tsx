import '../globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Vinicius Albuquerque',
  description: 'Senior Software Engineer with 5+ years of experience specializing in high-performance web and mobile applications using Next.js, React, TypeScript, Node.js, and Go.',
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  
  return (
    <html lang={lang || 'en'}>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
