import type { Metadata } from 'next';
import { type Locale } from '../../i18n-config';
import { getDictionary } from '../get-dictionary';
import AppContent from '../components/AppContent';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);

  return {
    description: dictionary.hero.subtitle,
  };
}

export default async function IndexPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);

  return <AppContent dictionary={dictionary} lang={lang} />;
}
