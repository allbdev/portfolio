import 'server-only';
import type { Locale } from '../i18n-config';

export interface Dictionary {
  navigation: {
    home: string;
    skills: string;
    projects: string;
    experience: string;
    contact: string;
  };
  hero: {
    title: string;
    subtitle: string;
    cta: string;
    downloadCv: string;
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
    liveDemo: string;
    viewCode: string;
    items: {
      title: string;
      description: string;
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
    subtitle: string;
    links: {
      email: string;
      linkedin: string;
      github: string;
    };
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
