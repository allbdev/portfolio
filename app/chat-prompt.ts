// Shared by the /api/chat route (Gemini in the cloud) and the in-browser
// engine (Chrome's built-in Gemini Nano), so both answer the same way.

export type ChatRole = 'user' | 'assistant';
export type ChatMessage = { role: ChatRole; content: string };

export const CHAT_LIMITS = {
  /** Characters per visitor message. */
  messageChars: 600,
  /** Most recent messages sent as context. */
  historyMessages: 12,
};

export function chatSystemPrompt(profile: string, lang: string) {
  return `You are the assistant on Vinicius Albuquerque's portfolio website. Visitors are mostly recruiters, hiring managers and engineers.

Rules:
- Answer only questions about Vinicius: his experience, projects, skills, availability, education and how to contact him. Use only the profile below; never invent employers, dates, numbers or skills.
- If the profile does not cover something, say so plainly and suggest emailing him.
- Politely decline anything unrelated (writing code, general knowledge, other people) in one sentence and steer back to Vinicius.
- Refer to him in the third person. Be warm, direct and concise: at most about 120 words unless asked for detail.
- Use plain text with light Markdown only: **bold**, "- " bullet lists and [links](https://...).
- Reply in the visitor's language. If unclear, use ${lang === 'pt' ? 'Brazilian Portuguese' : 'English'}.

<profile>
${profile}
</profile>`;
}

/** Trims and caps a client-supplied history so it is safe to forward. */
export function sanitizeHistory(input: unknown): ChatMessage[] | null {
  if (!Array.isArray(input) || input.length === 0) return null;
  const messages: ChatMessage[] = [];
  for (const item of input.slice(-CHAT_LIMITS.historyMessages)) {
    if (!item || typeof item !== 'object') return null;
    const { role, content } = item as Record<string, unknown>;
    if ((role !== 'user' && role !== 'assistant') || typeof content !== 'string') return null;
    const text = content.trim().slice(0, role === 'user' ? CHAT_LIMITS.messageChars : 2000);
    if (text) messages.push({ role, content: text });
  }
  if (messages.at(-1)?.role !== 'user') return null;
  return messages;
}
