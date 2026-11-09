'use client';

import { useEffect, useState } from 'react';
import { chatSystemPrompt, CHAT_LIMITS, type ChatMessage } from '../../chat-prompt';

/**
 * Picks where answers come from, cheapest first:
 *   1. Chrome's built-in Gemini Nano (Prompt API): free, private, on-device.
 *   2. /api/chat (Gemini free tier) for every other browser.
 * Both stream text; the caller only sees `onDelta` chunks.
 */
export type EngineKind = 'device' | 'cloud';

export class ChatUnavailableError extends Error {
  constructor(public reason: 'not_configured' | 'rate_limited' | 'failed') {
    super(reason);
  }
}

// Minimal typings for the Prompt API (https://developer.chrome.com/docs/ai/prompt-api).
type LMOptions = {
  expectedInputs?: { type: 'text'; languages?: string[] }[];
  expectedOutputs?: { type: 'text'; languages?: string[] }[];
  initialPrompts?: { role: 'system' | 'user' | 'assistant'; content: string }[];
  signal?: AbortSignal;
};
type LMSession = {
  promptStreaming(input: string, options?: { signal?: AbortSignal }): ReadableStream<string>;
  destroy(): void;
};
type LanguageModelStatic = {
  availability(options?: LMOptions): Promise<'unavailable' | 'downloadable' | 'downloading' | 'available'>;
  create(options?: LMOptions): Promise<LMSession>;
};
const LanguageModel = () => (globalThis as unknown as { LanguageModel?: LanguageModelStatic }).LanguageModel;

const languageOptions = (lang: string): LMOptions => ({
  expectedInputs: [{ type: 'text', languages: [lang, 'en'] }],
  expectedOutputs: [{ type: 'text', languages: [lang] }],
});

/**
 * True only when Nano is already on the machine. We never trigger the
 * multi-GB model download for a portfolio visit.
 */
export async function onDeviceReady(lang: string) {
  try {
    return (await LanguageModel()?.availability(languageOptions(lang))) === 'available';
  } catch {
    return false;
  }
}

let profile: Promise<string> | undefined;
const loadProfile = () =>
  (profile ??= fetch('/llms.txt').then((response) => {
    if (!response.ok) throw new Error('profile');
    return response.text();
  }));

async function readStream(stream: ReadableStream<string>, onDelta: (text: string) => void) {
  const reader = stream.getReader();
  for (;;) {
    const { done, value } = await reader.read();
    if (done) return;
    onDelta(value);
  }
}

async function askDevice(history: ChatMessage[], lang: string, onDelta: (text: string) => void, signal: AbortSignal) {
  const api = LanguageModel();
  if (!api) throw new Error('no prompt api');
  const recent = history.slice(-CHAT_LIMITS.historyMessages);
  const question = recent.at(-1)!.content;
  const session = await api.create({
    ...languageOptions(lang),
    initialPrompts: [{ role: 'system', content: chatSystemPrompt(await loadProfile(), lang) }, ...recent.slice(0, -1)],
    signal,
  });
  try {
    await readStream(session.promptStreaming(question, { signal }), onDelta);
  } finally {
    session.destroy();
  }
}

async function askCloud(history: ChatMessage[], lang: string, onDelta: (text: string) => void, signal: AbortSignal) {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages: history.slice(-CHAT_LIMITS.historyMessages), lang }),
    signal,
  });
  if (!response.ok || !response.body) {
    const { error } = await response.json().catch(() => ({ error: '' }));
    throw new ChatUnavailableError(
      error === 'not_configured' ? 'not_configured' : response.status === 429 ? 'rate_limited' : 'failed',
    );
  }
  const decoder = new TextDecoder();
  await readStream(
    response.body.pipeThrough(
      new TransformStream<Uint8Array, string>({
        transform: (chunk, controller) => controller.enqueue(decoder.decode(chunk, { stream: true })),
      }),
    ),
    onDelta,
  );
}

/** Streams one answer. Falls back from device to cloud if Nano fails mid-way. */
export async function ask(
  engine: EngineKind,
  history: ChatMessage[],
  lang: string,
  onDelta: (text: string) => void,
  signal: AbortSignal,
): Promise<EngineKind> {
  if (engine === 'device') {
    let received = false;
    try {
      await askDevice(
        history,
        lang,
        (text) => {
          received = true;
          onDelta(text);
        },
        signal,
      );
      return 'device';
    } catch (error) {
      if (signal.aborted || received) throw error;
      // e.g. the profile does not fit Nano's context window: use the cloud.
    }
  }
  await askCloud(history, lang, onDelta, signal);
  return 'cloud';
}

let available: Promise<boolean> | undefined;

/** Whether any engine can answer: Nano is on the device, or the API has a key. */
export function chatAvailable(lang: string) {
  return (available ??= onDeviceReady(lang).then(
    (ready) =>
      ready ||
      fetch('/api/chat')
        .then((response) => response.json())
        .then((data: { available?: boolean }) => Boolean(data.available))
        .catch(() => false),
  ));
}

export function useChatAvailable(lang: string) {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    let live = true;
    chatAvailable(lang).then((value) => live && setOk(value));
    return () => {
      live = false;
    };
  }, [lang]);
  return ok;
}
