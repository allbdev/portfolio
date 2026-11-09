import { buildProfile } from '../profile';

// Built once at deploy time from the same dictionary the site renders, so the
// file can never drift from what the page says. https://llmstxt.org
export const dynamic = 'force-static';

export async function GET() {
  return new Response(await buildProfile(), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
