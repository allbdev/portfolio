import '../globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Developer Portfolio',
  description: 'Full-Stack Developer Portfolio',
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
