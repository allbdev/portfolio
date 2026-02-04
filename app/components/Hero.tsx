'use client';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';

import { Dictionary } from '../get-dictionary';

export default function Hero({ dictionary }: { dictionary: Dictionary }) {
  return (
    <Box
      id="home"
      component="section"
      sx={{
        pt: 15,
        pb: 10,
        display: 'flex',
        alignItems: 'center',
        minHeight: '80vh',
      }}
    >
      <Container maxWidth="md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <Typography
            component="h1"
            variant="h2"
            sx={{
              mb: 4,
              background: (theme) =>
                `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              // Fallback for no gradient support if needed, though most browsers support it.
              color: 'primary.main',
              fontWeight: 800,
            }}
          >
            {dictionary.hero.title}
          </Typography>
        </motion.div>
        
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
        >
            <Typography variant="h5" color="text.secondary" paragraph sx={{ mb: 6, lineHeight: 1.6 }}>
            {dictionary.hero.subtitle}
            </Typography>
        </motion.div>

        <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 1, delay: 0.4 }}
        >
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button variant="contained" size="large" href="#projects" sx={{ py: 1.5, px: 4, fontSize: '1rem' }}>
                {dictionary.hero.cta}
              </Button>
              <Button 
                variant="outlined" 
                size="large" 
                href="/cv.pdf" 
                download
                target="_blank"
                sx={{ py: 1.5, px: 4, fontSize: '1rem' }}
              >
                {dictionary.hero.downloadCv}
              </Button>
            </Box>
        </motion.div>
      </Container>
    </Box>
  );
}
