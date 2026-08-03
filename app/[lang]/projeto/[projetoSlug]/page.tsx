import { notFound } from 'next/navigation';
import { i18n, type Locale } from '../../../../i18n-config';
import { getDictionary } from '../../../get-dictionary';
import ThemeRegistry from '../../../components/ThemeRegistry/ThemeRegistry';
import ProjectDetail from '../../../components/ProjectDetail';

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
  params: Promise<{ lang: Locale; projetoSlug: string }>;
}) {
  const { lang, projetoSlug } = await params;
  const dictionary = await getDictionary(lang);

  const project = dictionary.projects.items.find(
    (item) => item.slug === projetoSlug,
  );

  if (!project) {
    notFound();
  }

  return (
    <ThemeRegistry>
      <ProjectDetail project={project} dictionary={dictionary} lang={lang} />
    </ThemeRegistry>
  );
}
