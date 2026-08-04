'use client';

import Box from '@mui/material/Box';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import { site } from '../site';

const links = [
  { href: site.github, label: 'GitHub', Icon: GitHubIcon, external: true },
  { href: site.linkedin, label: 'LinkedIn', Icon: LinkedInIcon, external: true },
  { href: `mailto:${site.email}`, label: 'Email', Icon: MailOutlineIcon, external: false },
];

export default function SocialLinks({ size = 18 }: { size?: number }) {
  return (
    <Box sx={{ display: 'flex', gap: 1.75, alignItems: 'center' }}>
      {links.map(({ href, label, Icon, external }) => (
        <Box
          key={label}
          component="a"
          href={href}
          aria-label={label}
          {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
          sx={{
            color: 'text.secondary',
            display: 'flex',
            transition: 'color 0.2s',
            '&:hover': { color: 'accent.text' },
          }}
        >
          <Icon sx={{ fontSize: size }} />
        </Box>
      ))}
    </Box>
  );
}
