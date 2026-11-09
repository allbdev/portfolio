import 'server-only';
import type { Locale } from '../i18n-config';

export interface Dictionary {
  navigation: {
    home: string;
    about: string;
    projects: string;
    experience: string;
    skills: string;
    contact: string;
  };
  hero: {
    /** Mono eyebrow above the name. */
    eyebrow: string;
    /** Short role label used in the sidebar. */
    role: string;
    /** Short lead paragraph shown under the name. */
    intro: string;
    /** Long-form bio, used as the page meta description. */
    subtitle: string;
    cta: string;
    downloadCv: string;
    /** Availability line next to the CTAs. */
    status: string;
    stats: { value: string; label: string }[];
    /** Labels for the 3D commit skyline. `{n}` is replaced with a number. */
    skyline: {
      caption: string;
      commit: string;
      commits: string;
      noCommits: string;
      streak: string;
      activeDays: string;
      dragHint: string;
      less: string;
      more: string;
    };
  };
  about: {
    title: string;
    lead: string[];
    facts: { label: string; value: string; live?: boolean }[];
    terminal: {
      title: string;
      hint: string;
      /** Typed out when the terminal first scrolls into view. Lines starting with # print dimmed. */
      script: { cmd: string; out: string[] }[];
      help: string[];
      commands: { whoami: string[]; about: string[]; status: string[]; llms: string[] };
      openHint: string;
      opening: string;
      notFound: string;
      themeSwitched: string;
      sudo: string;
      hire: string[];
      exit: string;
      askUsage: string;
      askThinking: string;
      askFallback: string;
    };
  };
  palette: {
    trigger: string;
    placeholder: string;
    empty: string;
    footer: string;
    caseStudy: string;
    groups: { navigate: string; projects: string; actions: string; links: string };
    actions: {
      terminal: string;
      copyEmail: string;
      copied: string;
      downloadCv: string;
      toggleTheme: string;
      switchLang: string;
      sendEmail: string;
      copyPrompt: string;
      promptCopied: string;
      askAi: string;
    };
  };
  /** "Ask your AI" section. `{url}` in the prompt becomes the llms.txt link. */
  ai: {
    eyebrow: string;
    title: string;
    text: string;
    prompt: string;
    copy: string;
    copied: string;
    open: string;
    viewFile: string;
    chatHere: string;
  };
  /** Floating AI chat (Gemini Nano on-device, else the /api/chat free tier). */
  chat: {
    open: string;
    title: string;
    placeholder: string;
    greeting: string;
    suggestions: string[];
    send: string;
    stop: string;
    clear: string;
    close: string;
    engines: { device: string; cloud: string };
    deviceNote: string;
    errors: { not_configured: string; rate_limited: string; failed: string };
    fallback: string;
    disclaimer: string;
  };
  skills: {
    title: string;
    categories: {
      label: string;
      items: string[];
    }[];
  };
  projects: {
    title: string;
    /** Eyebrow on the featured card. */
    featuredLabel: string;
    liveDemo: string;
    viewCode: string;
    /** Short "Code" label used on the compact cards. */
    code: string;
    viewDetails: string;
    detail: {
      eyebrow: string;
      back: string;
      overview: string;
      highlights: string;
      technologies: string;
      /** Link to the case study's Markdown version. */
      markdown: string;
    };
    items: {
      title: string;
      slug: string;
      description: string;
      summary: string;
      longDescription: string;
      highlights: string[];
      screenshots: { src: string; alt: string }[];
      liveUrl: string;
      githubUrl?: string;
      techStack: string[];
    }[];
  };
  experience: {
    title: string;
    educationTitle: string;
    /** "+ {n} more" toggle under long achievement lists. */
    showMore: string;
    showLess: string;
    /** Top of the git graph: current status. */
    head: { branch: string; date: string; title: string; text: string };
    /** Bottom of the git graph: where it all started. */
    root: { date: string; title: string };
    jobs: {
      company: string;
      /** Branch label on the git graph. */
      branch: string;
      role: string;
      period: string;
      stack: string[];
      description: string;
      achievements: string[];
    }[];
    education: {
      title: string;
      institution: string;
      description: string;
    }[];
  };
  contact: {
    title: string;
    /** Right-hand footer line. */
    location: string;
    copyright: string;
  };
}

const dictionaries = {
  en: () => import('./dictionaries/en.json').then((module) => module.default),
  pt: () => import('./dictionaries/pt.json').then((module) => module.default),
};

export const getDictionary = async (locale: Locale): Promise<Dictionary> => {
  const loadDictionary = dictionaries[locale] ?? dictionaries.en;
  return loadDictionary() as Promise<Dictionary>;
};
