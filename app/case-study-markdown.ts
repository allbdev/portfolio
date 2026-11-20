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
    project.liveUrl ? `- ${liveDemo}: ${project.liveUrl}` : project.status ? `- Status: ${project.status}` : null,
    project.githubUrl ? `- ${viewCode}: ${project.githubUrl}` : null,
    `- ${detail.caseStudy} (HTML): ${page}`,
  ].filter(Boolean);

  const cs = project.caseStudy;
  const bullets = (items: string[]) => items.map((item) => `- ${item}`).join('\n');
  const architecture = project.architecture
    ? `\n## ${detail.architecture}\n\n${project.architecture.nodes
        .map((node) => `${node.label} (${node.items.join('; ')})`)
        .join(' → ')}${project.architecture.note ? `\n\n${project.architecture.note}` : ''}\n`
    : '';

  const body = cs
    ? `## ${detail.problem}

${cs.problem}

## ${detail.built}

${bullets(project.highlights)}

## ${detail.hardPart}: ${cs.hardPart.title}

${cs.hardPart.text}

## ${detail.result}

${cs.result}
${architecture}
## ${detail.overview}

${project.longDescription}`
    : `## ${detail.overview}

${project.longDescription}

## ${detail.highlights}

${bullets(project.highlights)}
${architecture}`;

  const screenshots = project.screenshots.map((shot) => `![${shot.alt}](${site.url}${shot.src})`);

  return `# ${project.title}

> ${project.summary}

${[detail.caseStudy, name, project.role, project.period].filter(Boolean).join(' · ')} · ${site.url}/${lang}

${links.join('\n')}

${body}

## ${detail.technologies}

${project.techStack.join(', ')}
${screenshots.length ? `\n## Screenshots\n\n${screenshots.join('\n\n')}\n` : ''}`;
}
