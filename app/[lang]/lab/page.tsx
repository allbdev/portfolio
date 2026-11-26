import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { i18n, isValidLocale } from '../../../i18n-config';
import { getDictionary } from '../../get-dictionary';
import LabPage from '../../components/LabPage';

export function generateStaticParams() {
  return i18n.locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isValidLocale(lang)) return {};

  const dictionary = await getDictionary(lang);
  const title = `${dictionary.projects.lab.pageTitle} · Vinícius Albuquerque`;
  const description = dictionary.projects.lab.metaDescription;

  return {
    title,
    description,
    alternates: {
      canonical: `/${lang}/lab`,
      languages: { en: '/en/lab', 'pt-BR': '/pt/lab', 'x-default': '/en/lab' },
    },
    openGraph: { title, description, url: `/${lang}/lab` },
  };
}

export default async function LabRoute({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isValidLocale(lang)) notFound();

  const dictionary = await getDictionary(lang);
  return <LabPage dictionary={dictionary} lang={lang} />;
}
