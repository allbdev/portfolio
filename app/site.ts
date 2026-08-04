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
    'Node.js',
    'NestJS',
    'SolidJS',
    'PostgreSQL',
    'Prisma',
    'AWS',
    'Docker',
    'GraphQL',
    'Tailwind CSS',
  ],
} as const;

/** Section ids in page order, paired with the dictionary key that labels them. */
export const sections = [
  { id: 'home', key: 'home', index: '00' },
  { id: 'projects', key: 'projects', index: '01' },
  { id: 'experience', key: 'experience', index: '02' },
  { id: 'skills', key: 'skills', index: '03' },
  { id: 'contact', key: 'contact', index: '04' },
] as const;
