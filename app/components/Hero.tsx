'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem } from './motion/variants';
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
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={staggerItem}>
            <Typography
              component="h1"
              variant="h2"
              sx={{
                mb: 4,
                background: (theme) =>
                  `linear-gradient(120deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                color: 'primary.main',
                fontWeight: 800,
              }}
            >
              {dictionary.hero.title}
            </Typography>
          </motion.div>

          <motion.div variants={staggerItem}>
            <Typography
              variant="h5"
              color="text.secondary"
              paragraph
              sx={{ mb: 6, lineHeight: 1.65, whiteSpace: 'pre-line' }}
            >
              {dictionary.hero.subtitle}
            </Typography>
          </motion.div>

          <motion.div variants={staggerItem}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                <Button
                  variant="contained"
                  size="large"
                  href="#projects"
                  sx={{ py: 1.5, px: 4, fontSize: '1rem' }}
                >
                  {dictionary.hero.cta}
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                <Button
                  variant="outlined"
                  size="large"
                  color="secondary"
                  href="/cv.pdf"
                  download
                  target="_blank"
                  sx={{ py: 1.5, px: 4, fontSize: '1rem' }}
                >
                  {dictionary.hero.downloadCv}
                </Button>
              </motion.div>
            </Box>
          </motion.div>
        </motion.div>
      </Container>
    </Box>
  );
}
