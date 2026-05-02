'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { cardHover, staggerContainer, staggerItem } from './motion/variants';
import SectionHeading from './SectionHeading';
import TiltCard from './TiltCard';
import { Dictionary } from '../get-dictionary';

const MotionCard = motion(Card);

export default function Skills({ dictionary }: { dictionary: Dictionary }) {
  return (
    <Box
      id="skills"
      component="section"
      sx={{
        py: 10,
        bgcolor: (theme) =>
          theme.palette.mode === 'light' ? 'rgba(255,255,255,0.72)' : 'rgba(21, 31, 50, 0.65)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <Container maxWidth="lg">
        <SectionHeading title={dictionary.skills.title} />
        <Grid
          container
          spacing={3}
          component={motion.div}
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          {dictionary.skills.categories.map((category: Dictionary['skills']['categories'][number]) => (
            <Grid key={category.label} size={{ xs: 12, md: 6 }} component={motion.div} variants={staggerItem}>
              <TiltCard maxTilt={4}>
                <MotionCard
                  variants={cardHover}
                  initial="rest"
                  whileHover="hover"
                  whileTap="tap"
                  sx={{ height: '100%' }}
                >
                  <CardContent>
                    <Typography
                      variant="h6"
                      component="h3"
                      gutterBottom
                      sx={{
                        fontWeight: 700,
                        background: (theme) =>
                          `linear-gradient(90deg, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      {category.label}
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                      {category.items.map((item) => (
                        <motion.div
                          key={item}
                          whileHover={{ scale: 1.12, y: -3 }}
                          whileTap={{ scale: 0.95 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                        >
                          <Chip label={item} size="small" color="secondary" variant="outlined" />
                        </motion.div>
                      ))}
                    </Box>
                  </CardContent>
                </MotionCard>
              </TiltCard>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
