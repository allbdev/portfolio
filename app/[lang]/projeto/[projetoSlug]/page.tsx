import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { i18n, isValidLocale, type Locale } from '../../../../i18n-config';
import { getDictionary } from '../../../get-dictionary';
import ProjectDetail from '../../../components/ProjectDetail';
import { caseStudyMarkdownPath } from '../../../case-study-markdown';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; projetoSlug: string }>;
}): Promise<Metadata> {
  const { lang, projetoSlug } = await params;

  if (!isValidLocale(lang)) {
    return {};
  }

  const dictionary = await getDictionary(lang);

  const project = dictionary.projects.items.find(
    (item) => item.slug === projetoSlug,
  );

  if (!project) {
    return {};
  }

  const title = `${project.title} · Vinícius Albuquerque`;
  const description = project.summary || project.description;
  const firstScreenshot = project.screenshots?.[0];

  return {
    title,
    description,
    alternates: {
      canonical: `/${lang}/projeto/${project.slug}`,
      languages: {
        en: `/en/projeto/${project.slug}`,
        'pt-BR': `/pt/projeto/${project.slug}`,
        'x-default': `/en/projeto/${project.slug}`,
      },
      types: { 'text/markdown': caseStudyMarkdownPath(lang, project.slug) },
    },
    openGraph: {
      title,
      description,
      // Work under NDA has no screenshots: fall back to the site's social card.
      images: [
        firstScreenshot
          ? { url: firstScreenshot.src, alt: firstScreenshot.alt }
          : { url: `/${lang}/opengraph-image`, width: 1200, height: 630, alt: title },
      ],
    },
  };
}

export async function generateStaticParams() {
  const params: { lang: Locale; projetoSlug: string }[] = [];

  for (const lang of i18n.locales) {
    const dictionary = await getDictionary(lang);
    for (const project of dictionary.projects.items) {
      params.push({ lang, projetoSlug: project.slug });
    }
  }

  return params;
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ lang: string; projetoSlug: string }>;
}) {
  const { lang, projetoSlug } = await params;

  if (!isValidLocale(lang)) {
    notFound();
  }

  const dictionary = await getDictionary(lang);

  const project = dictionary.projects.items.find(
    (item) => item.slug === projetoSlug,
  );

  if (!project) {
    notFound();
  }

  return <ProjectDetail project={project} dictionary={dictionary} lang={lang} />;
}
