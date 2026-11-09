import { chatSystemPrompt, sanitizeHistory } from '../../chat-prompt';
import { buildProfile } from '../../profile';

/**
 * Streams answers about Vinicius from Gemini's free tier.
 *
 * Needs GEMINI_API_KEY (free at https://aistudio.google.com/apikey, no card).
 * Without a key, or once the free quota runs out, it answers 503/429 and the
 * chat widget falls back to the "Ask your AI" links, so it can never bill.
 */
export const runtime = 'nodejs';

const MODEL = process.env.GEMINI_MODEL ?? 'gemini-flash-lite-latest';
const API_BASE = process.env.GEMINI_API_BASE ?? 'https://generativelanguage.googleapis.com/v1beta';

// Best-effort per-IP limit. Serverless instances do not share memory, so this
// only blunts bursts; Google's free-tier quota is the real ceiling.
const WINDOW_MS = 10 * 60_000;
const MAX_PER_WINDOW = 20;
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((time) => now - time < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

let profile: Promise<string> | undefined;

const json = (status: number, error: string) => Response.json({ error }, { status });

/** Lets the widget hide itself when no key is configured. */
export function GET() {
  return Response.json(
    { available: Boolean(process.env.GEMINI_API_KEY) },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}

export async function POST(request: Request) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return json(503, 'not_configured');

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'local';
  if (rateLimited(ip)) return json(429, 'rate_limited');

  let body: { messages?: unknown; lang?: unknown };
  try {
    body = await request.json();
  } catch {
    return json(400, 'bad_request');
  }
  const messages = sanitizeHistory(body.messages);
  if (!messages) return json(400, 'bad_request');
  const lang = body.lang === 'pt' ? 'pt' : 'en';

  profile ??= buildProfile();

  const upstream = await fetch(`${API_BASE}/models/${MODEL}:streamGenerateContent?alt=sse`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: chatSystemPrompt(await profile, lang) }] },
      contents: messages.map((message) => ({
        role: message.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: message.content }],
      })),
      generationConfig: { temperature: 0.4, maxOutputTokens: 1024 },
    }),
    signal: request.signal,
  }).catch(() => null);

  if (!upstream?.ok || !upstream.body) {
    if (upstream) console.error('chat upstream', upstream.status, await upstream.text().catch(() => ''));
    return json(upstream?.status === 429 ? 429 : 502, 'upstream');
  }

  // Gemini sends SSE events; forward only the answer text as a plain stream.
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = '';
  const toText = new TransformStream<Uint8Array, Uint8Array>({
    transform(chunk, controller) {
      buffer += decoder.decode(chunk, { stream: true });
      const events = buffer.split(/\r?\n\r?\n/);
      buffer = events.pop() ?? '';
      for (const event of events) {
        for (const line of event.split(/\r?\n/)) {
          if (!line.startsWith('data:')) continue;
          try {
            const data = JSON.parse(line.slice(5));
            const parts: { text?: string; thought?: boolean }[] = data.candidates?.[0]?.content?.parts ?? [];
            const text = parts
              .filter((part) => !part.thought)
              .map((part) => part.text ?? '')
              .join('');
            if (text) controller.enqueue(encoder.encode(text));
          } catch {
            // Ignore keep-alives and partial frames.
          }
        }
      }
    },
  });

  return new Response(upstream.body.pipeThrough(toText), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Chat-Engine': 'gemini',
    },
  });
}
