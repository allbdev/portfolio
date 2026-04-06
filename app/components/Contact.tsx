'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem } from './motion/variants';
import SectionHeading from './SectionHeading';
import { Dictionary } from '../get-dictionary';

export default function Contact({ dictionary }: { dictionary: Dictionary }) {
  return (
    <Box id="contact" component="section" sx={{ py: 10 }}>
      <Container maxWidth="md">
        <SectionHeading title={dictionary.contact.title} align="center" gutterBottomSpacing={2} />
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
        >
          <motion.div variants={staggerItem}>
            <Typography variant="h6" align="center" color="text.secondary" paragraph sx={{ mb: 6 }}>
              {dictionary.contact.subtitle}
            </Typography>
          </motion.div>

          <motion.div variants={staggerItem}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 3,
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}
            >
              {(
                [
                  {
                    href: dictionary.contact.links.email,
                    label: 'Email',
                    variant: 'contained' as const,
                    color: 'primary' as const,
                  },
                  {
                    href: dictionary.contact.links.linkedin,
                    label: 'LinkedIn',
                    variant: 'outlined' as const,
                    color: 'primary' as const,
                    target: '_blank' as const,
                  },
                  {
                    href: dictionary.contact.links.github,
                    label: 'GitHub',
                    variant: 'outlined' as const,
                    color: 'secondary' as const,
                    target: '_blank' as const,
                  },
                ] as const
              ).map((link) => (
                <motion.div key={link.label} whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    variant={link.variant}
                    color={link.color}
                    size="large"
                    href={link.href}
                    target={'target' in link ? link.target : undefined}
                    rel={'target' in link ? 'noreferrer' : undefined}
                    sx={{ px: 4, py: 1.5, minWidth: { xs: '100%', sm: 'auto' } }}
                  >
                    {link.label}
                  </Button>
                </motion.div>
              ))}
            </Box>
          </motion.div>

          <motion.div variants={staggerItem}>
            <Box
              component="footer"
              sx={{ mt: 10, textAlign: 'center', borderTop: 1, borderColor: 'divider', pt: 4 }}
            >
              <Typography variant="body2" color="text.secondary">
                {dictionary.contact.copyright}
              </Typography>
            </Box>
          </motion.div>
        </motion.div>
      </Container>
    </Box>
  );
}
