import type { MetadataRoute } from 'next';
import { i18n } from '../i18n-config';
import { getDictionary } from './get-dictionary';
import { site } from './site';

/** hreflang codes, matching the `alternates.languages` each page declares. */
const hreflang = { en: 'en', pt: 'pt-BR' } as const;

/** One entry per locale for a path, each pointing at its translations. */
function localized(path: string, priority: number): MetadataRoute.Sitemap {
  const url = (lang: string) => `${site.url}/${lang}${path}`;

  const languages: Record<string, string> = { 'x-default': url(i18n.defaultLocale) };
  for (const lang of i18n.locales) languages[hreflang[lang]] = url(lang);

  return i18n.locales.map((lang) => ({
    url: url(lang),
    changeFrequency: 'monthly',
    priority,
    alternates: { languages },
  }));
}

// Built at deploy time from the same dictionary that generates the pages, so
// a new case study shows up here without touching this file.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { projects } = await getDictionary(i18n.defaultLocale);

  return [
    ...localized('', 1),
    ...localized('/lab', 0.8),
    ...projects.items.flatMap((project) => localized(`/projeto/${project.slug}`, project.lab ? 0.6 : 0.8)),
  ];
}
