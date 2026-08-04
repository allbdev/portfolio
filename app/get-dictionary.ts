import 'server-only';
import type { Locale } from '../i18n-config';

export interface Dictionary {
  navigation: {
    home: string;
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
    stats: { value: string; label: string }[];
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
    jobs: {
      company: string;
      role: string;
      period: string;
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
