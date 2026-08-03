import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { i18n, type Locale } from '../../../../i18n-config';
import { getDictionary } from '../../../get-dictionary';
import ThemeRegistry from '../../../components/ThemeRegistry/ThemeRegistry';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale; projetoSlug: string }>;
}): Promise<Metadata> {
  const { lang, projetoSlug } = await params;
  const dictionary = await getDictionary(lang);

  const project = dictionary.projects.items.find(
    (item) => item.slug === projetoSlug,
  );

  if (!project) {
    return {};
  }

  const title = `${project.title} — Vinicius Albuquerque`;
  const description = project.summary || project.description;
  const firstScreenshot = project.screenshots?.[0];

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      ...(firstScreenshot
        ? {
            images: [
              {
                url: firstScreenshot.src,
                alt: firstScreenshot.alt,
              },
            ],
          }
        : {}),
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
      <Box
        component="main"
        sx={{ minHeight: '100vh', color: 'text.primary', py: { xs: 6, md: 10 } }}
      >
        <Container maxWidth="md">
          <Typography variant="body2" sx={{ color: 'primary.main' }}>
            <Link href={`/${lang}`} style={{ color: 'inherit' }}>
              ← {dictionary.navigation.home}
            </Link>
          </Typography>
          <Typography variant="h3" component="h1" sx={{ mt: 3, fontWeight: 700 }}>
            {project.title}
          </Typography>
          <Typography variant="body1" sx={{ mt: 3 }} color="text.secondary">
            {project.longDescription}
          </Typography>
        </Container>
      </Box>
    </ThemeRegistry>
  );
}
