export const i18n = {
  defaultLocale: 'en',
  locales: ['en', 'pt'],
} as const;

export type Locale = (typeof i18n)['locales'][number];

/** Narrows an arbitrary route segment to a supported locale. */
export function isValidLocale(value: string): value is Locale {
  return (i18n.locales as readonly string[]).includes(value);
}
