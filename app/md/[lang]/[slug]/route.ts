import { caseStudyMarkdown } from '../../../case-study-markdown';
import { getDictionary } from '../../../get-dictionary';
import { i18n, isValidLocale } from '../../../../i18n-config';

// Served publicly at /:lang/projeto/:slug.md through a rewrite in next.config.ts.
export const dynamic = 'force-static';
export const dynamicParams = false;

export async function generateStaticParams() {
  const params: { lang: string; slug: string }[] = [];
  for (const lang of i18n.locales) {
    const dictionary = await getDictionary(lang);
    for (const project of dictionary.projects.items) params.push({ lang, slug: project.slug });
  }
  return params;
}

export async function GET(_request: Request, { params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  if (!isValidLocale(lang)) return new Response('Not found', { status: 404 });

  const dictionary = await getDictionary(lang);
  const project = dictionary.projects.items.find((item) => item.slug === slug);
  if (!project) return new Response('Not found', { status: 404 });

  return new Response(caseStudyMarkdown(project, dictionary, lang), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
}
