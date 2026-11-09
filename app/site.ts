/** Language-independent facts about the site owner. */
export const site = {
  firstName: 'Vinícius',
  lastName: 'Albuquerque',
  email: 'vini.alb13@gmail.com',
  github: 'https://github.com/allbdev',
  linkedin: 'https://www.linkedin.com/in/albuquerque-vinicius',
  cv: '/cv.pdf',
  year: 2026,
  /** Scrolling tech band under the hero. */
  marquee: [
    'React',
    'TypeScript',
    'Go',
    'Next.js',
    'React Native',
    'Expo',
    'Node.js',
    'NestJS',
    'SolidJS',
    'PostgreSQL',
    'Prisma',
    'AWS',
    'Docker',
    'Tailwind CSS',
    'Vega',
    'Malloy',
  ],
} as const;

/** Section ids in page order, paired with the dictionary key that labels them. */
export const sections = [
  { id: 'home', key: 'home', index: '00' },
  { id: 'about', key: 'about', index: '01' },
  { id: 'projects', key: 'projects', index: '02' },
  { id: 'experience', key: 'experience', index: '03' },
  { id: 'skills', key: 'skills', index: '04' },
  { id: 'contact', key: 'contact', index: '05' },
] as const;
