'use client';

import { useRef } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { motion, useScroll, useTransform } from 'framer-motion';
import { staggerContainer, staggerItem, blurFadeUp } from './motion/variants';
import { Dictionary } from '../get-dictionary';

const MotionBox = motion(Box);

export default function Hero({ dictionary }: { dictionary: Dictionary }) {
  const heroRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const indicatorOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  return (
    <Box
      ref={heroRef}
      id="home"
      component="section"
      sx={{
        pt: 15,
        pb: 10,
        display: 'flex',
        alignItems: 'center',
        minHeight: '80vh',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Container maxWidth="md">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          style={{ y: contentY }}
        >
          <motion.div variants={blurFadeUp}>
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

          <motion.div variants={staggerItem}>
            <MotionBox
              style={{ opacity: indicatorOpacity }}
              sx={{ mt: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}
            >
              <motion.div
                animate={{ y: [0, 7, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, opacity: 0.45 }}
              >
                <Typography variant="overline" sx={{ fontSize: '0.6rem', letterSpacing: 3 }}>
                  scroll
                </Typography>
                <KeyboardArrowDownIcon sx={{ fontSize: 18 }} />
              </motion.div>
            </MotionBox>
          </motion.div>
        </motion.div>
      </Container>
    </Box>
  );
}
