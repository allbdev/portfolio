import { type Locale } from '../../i18n-config';
import { getDictionary } from '../get-dictionary';
import ThemeRegistry from '../components/ThemeRegistry/ThemeRegistry';
import AppContent from '../components/AppContent';

export default async function IndexPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);

  return (
    <ThemeRegistry>
      <AppContent dictionary={dictionary} />
    </ThemeRegistry>
  );
}
