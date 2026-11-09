export const OPEN_CHAT_EVENT = 'open-ai-chat';

/** Opens the chat widget from anywhere; pass a question to send it right away. */
export const openChat = (question?: string) =>
  window.dispatchEvent(new CustomEvent(OPEN_CHAT_EVENT, { detail: { question } }));
