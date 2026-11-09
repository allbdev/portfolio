import { Fragment, type ReactNode } from 'react';
import Box from '@mui/material/Box';

/**
 * Just enough Markdown for chat answers: paragraphs, "- " bullets, **bold**,
 * [links](https://…) and bare URLs. Everything is rendered as React text, so
 * model output can never inject HTML.
 */
const INLINE = /\*\*([^*]+)\*\*|\[([^\]]+)\]\((https?:\/\/[^\s)]+|mailto:[^\s)]+|\/[^\s)]*)\)|(https?:\/\/[^\s)]+)/g;

function inline(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  for (const match of text.matchAll(INLINE)) {
    if (match.index > last) out.push(text.slice(last, match.index));
    const [, bold, label, href, bare] = match;
    if (bold) out.push(<strong key={match.index}>{bold}</strong>);
    else {
      const url = href ?? bare;
      out.push(
        <Box
          key={match.index}
          component="a"
          href={url}
          target={url.startsWith('/') ? undefined : '_blank'}
          rel="noreferrer"
          sx={{ color: 'accent.text', textDecoration: 'underline', textUnderlineOffset: 2, wordBreak: 'break-word' }}
        >
          {label ?? bare}
        </Box>,
      );
    }
    last = match.index + match[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export default function Markdown({ text }: { text: string }) {
  const blocks: ReactNode[] = [];
  let bullets: string[] = [];
  const flush = () => {
    if (!bullets.length) return;
    blocks.push(
      <Box key={`ul-${blocks.length}`} component="ul" sx={{ m: 0, pl: 2.25, '& li + li': { mt: 0.5 } }}>
        {bullets.map((item, index) => (
          <li key={index}>{inline(item)}</li>
        ))}
      </Box>,
    );
    bullets = [];
  };

  for (const raw of text.split('\n')) {
    const line = raw.trim();
    const bullet = line.match(/^[-*•]\s+(.*)$/);
    if (bullet) {
      bullets.push(bullet[1]);
      continue;
    }
    flush();
    if (line)
      blocks.push(
        <Box key={`p-${blocks.length}`} component="p" sx={{ m: 0 }}>
          {inline(line.replace(/^#+\s*/, ''))}
        </Box>,
      );
  }
  flush();

  return (
    <Box sx={{ display: 'grid', gap: 1 }}>
      {blocks.map((block, index) => (
        <Fragment key={index}>{block}</Fragment>
      ))}
    </Box>
  );
}
