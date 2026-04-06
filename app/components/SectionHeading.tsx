'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { fadeUp, sectionTitleLine } from './motion/variants';

const MotionBox = motion(Box);

type SectionHeadingProps = {
  title: string;
  align?: 'left' | 'center';
  gutterBottomSpacing?: number;
};

export default function SectionHeading({
  title,
  align = 'left',
  gutterBottomSpacing = 6,
}: SectionHeadingProps) {
  return (
    <Box sx={{ mb: gutterBottomSpacing }}>
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
      >
        <Typography variant="h3" component="h2" align={align} sx={{ fontWeight: 700 }}>
          {title}
        </Typography>
        <MotionBox
          variants={sectionTitleLine}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          sx={{
            display: 'block',
            height: 3,
            width: align === 'center' ? 72 : 96,
            mx: align === 'center' ? 'auto' : 0,
            mt: 1.5,
            borderRadius: 999,
            background: (theme) =>
              `linear-gradient(90deg, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
            transformOrigin: align === 'center' ? 'center' : 'left',
            boxShadow: (theme) => `0 0 20px ${alpha(theme.palette.secondary.main, 0.45)}`,
          }}
        />
      </motion.div>
    </Box>
  );
}
