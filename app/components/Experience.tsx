'use client';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import { motion } from 'framer-motion';
import Grid from '@mui/material/Grid';
import { blurFadeUp, slideFromLeft, staggerContainer, staggerItem } from './motion/variants';
import SectionHeading from './SectionHeading';
import TiltCard from './TiltCard';
import { Dictionary } from '../get-dictionary';

export default function Experience({ dictionary }: { dictionary: Dictionary }) {
  return (
    <Box
      id="experience"
      component="section"
      sx={{
        py: 10,
        bgcolor: (theme) =>
          theme.palette.mode === 'light' ? 'rgba(255,255,255,0.72)' : 'rgba(21, 31, 50, 0.65)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <Container maxWidth="lg">
        <SectionHeading title={dictionary.experience.title} />

        <Box sx={{ maxWidth: 800, mx: 'auto' }}>
          <Stepper orientation="vertical">
            {dictionary.experience.jobs.map((job: Dictionary['experience']['jobs'][number], jobIndex: number) => (
              <Step key={`${job.company}-${job.period}`} active>
                <StepLabel
                  StepIconProps={{
                    sx: { color: 'secondary.main' },
                  }}
                >
                  <motion.div
                    variants={slideFromLeft}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ delay: jobIndex * 0.08 } as never}
                  >
                    <Box>
                      <Typography variant="h6" fontWeight="bold" component="span">
                        {job.role}
                      </Typography>
                      <Typography variant="subtitle1" component="span" color="secondary" sx={{ ml: 1 }}>
                        @ {job.company}
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary" display="block">
                      {job.period}
                    </Typography>
                  </motion.div>
                </StepLabel>
                <StepContent>
                  <motion.div
                    variants={blurFadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-40px' }}
                  >
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        mb: 2,
                        bgcolor: (theme) =>
                          theme.palette.mode === 'light'
                            ? 'rgba(248, 250, 252, 0.9)'
                            : 'rgba(15, 23, 42, 0.55)',
                        border: (theme) => `1px solid ${theme.palette.divider}`,
                      }}
                    >
                      <Typography paragraph>{job.description}</Typography>
                      <Box component="ul" sx={{ pl: 2, m: 0 }}>
                        {job.achievements.map((achievement, achievementIndex) => (
                          <li key={`${achievementIndex}-${achievement.slice(0, 24)}`}>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                              {achievement}
                            </Typography>
                          </li>
                        ))}
                      </Box>
                    </Paper>
                  </motion.div>
                </StepContent>
              </Step>
            ))}
          </Stepper>
        </Box>

        <Box sx={{ mt: 10 }}>
          <SectionHeading title={dictionary.experience.educationTitle} gutterBottomSpacing={4} />
          <Grid
            container
            spacing={3}
            component={motion.div}
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
          >
            {dictionary.experience.education.map((edu: Dictionary['experience']['education'][number]) => (
              <Grid
                key={`${edu.title}-${edu.institution}`}
                size={{ xs: 12, sm: 6, md: 4 }}
                component={motion.div}
                variants={staggerItem}
              >
                <TiltCard maxTilt={4}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      height: '100%',
                      border: (theme) => `1px solid ${theme.palette.divider}`,
                      transition: 'border-color 0.25s, box-shadow 0.25s',
                      '&:hover': {
                        borderColor: 'secondary.main',
                        boxShadow: (theme) => `0 4px 24px ${theme.palette.secondary.main}22`,
                      },
                    }}
                  >
                    <Typography variant="h6" gutterBottom>
                      {edu.title}
                    </Typography>
                    <Typography variant="subtitle2" color="secondary" gutterBottom>
                      {edu.institution}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {edu.description}
                    </Typography>
                  </Paper>
                </TiltCard>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}
