import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isValidLocale } from '../../i18n-config';
import { getDictionary } from '../get-dictionary';
import AppContent from '../components/AppContent';

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

  return {
    description: dictionary.hero.subtitle,
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

  return <AppContent dictionary={dictionary} lang={lang} />;
}
