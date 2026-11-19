import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isValidLocale } from '../../i18n-config';
import { getDictionary } from '../get-dictionary';
import AppContent from '../components/AppContent';
import { site } from '../site';

const name = `${site.firstName} ${site.lastName}`;
const title = `${name} · Senior Full-stack Engineer`;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;

  if (!isValidLocale(lang)) {
    return {};
  }

  const dictionary = await getDictionary(lang);

  const description = dictionary.hero.subtitle.replace(/\s*\n+\s*/g, ' ');

  return {
    title,
    description,
    alternates: {
      canonical: `/${lang}`,
      languages: { en: '/en', 'pt-BR': '/pt', 'x-default': '/en' },
    },
    openGraph: {
      type: 'profile',
      title,
      description,
      url: `/${lang}`,
      siteName: name,
      locale: lang === 'pt' ? 'pt_BR' : 'en_US',
    },
  };
}

export default async function IndexPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  if (!isValidLocale(lang)) {
    notFound();
  }

  const dictionary = await getDictionary(lang);

  const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
    jobTitle: 'Senior Full-stack Engineer',
    url: `${site.url}/${lang}`,
    email: `mailto:${site.email}`,
    address: { '@type': 'PostalAddress', addressLocality: 'Vila Velha', addressCountry: 'BR' },
    knowsLanguage: ['pt-BR', 'en'],
    knowsAbout: ['React', 'Next.js', 'TypeScript', 'Node.js', 'NestJS', 'Go', 'PostgreSQL', 'AWS', 'MCP'],
    sameAs: [site.linkedin, site.github, 'https://www.path-trader.com.br/'],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd).replace(/</g, '\\u003c') }}
      />
      <AppContent dictionary={dictionary} lang={lang} />
    </>
  );
}
