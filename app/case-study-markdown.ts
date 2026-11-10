import 'server-only';
import type { Dictionary } from './get-dictionary';
import { site } from './site';
import type { Locale } from '../i18n-config';

type Project = Dictionary['projects']['items'][number];

/** Public path of a case study's Markdown twin, e.g. /en/projeto/path-trader.md */
export const caseStudyMarkdownPath = (lang: Locale, slug: string) => `/${lang}/projeto/${slug}.md`;

/** The case study page rendered as Markdown, for AI assistants and plain-text readers. */
export function caseStudyMarkdown(project: Project, dictionary: Dictionary, lang: Locale) {
  const { detail, liveDemo, viewCode } = dictionary.projects;
  const name = `${site.firstName} ${site.lastName}`;
  const page = `${site.url}/${lang}/projeto/${project.slug}`;

  const links = [
    project.liveUrl ? `- ${liveDemo}: ${project.liveUrl}` : `- Status: ${project.status}`,
    project.githubUrl ? `- ${viewCode}: ${project.githubUrl}` : null,
    `- ${detail.eyebrow} (HTML): ${page}`,
  ].filter(Boolean);

  const screenshots = project.screenshots.map((shot) => `![${shot.alt}](${site.url}${shot.src})`);

  return `# ${project.title}

> ${project.summary}

${detail.eyebrow} · ${name} · ${site.url}/${lang}

${links.join('\n')}

## ${detail.overview}

${project.longDescription}

## ${detail.highlights}

${project.highlights.map((item) => `- ${item}`).join('\n')}

## ${detail.technologies}

${project.techStack.join(', ')}
${screenshots.length ? `\n## Screenshots\n\n${screenshots.join('\n\n')}\n` : ''}`;
}
