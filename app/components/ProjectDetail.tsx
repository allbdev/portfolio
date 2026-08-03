'use client';

import Link from 'next/link';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import GitHubIcon from '@mui/icons-material/GitHub';
import LanguageIcon from '@mui/icons-material/Language';
import { motion } from 'framer-motion';
import { fadeUp, staggerContainer, staggerItem } from './motion/variants';
import AmbientBackground from './AmbientBackground';
import CursorGlow from './CursorGlow';
import SectionHeading from './SectionHeading';
import TiltCard from './TiltCard';
import ScreenshotCarousel from './ScreenshotCarousel';
import { Dictionary } from '../get-dictionary';

type Project = Dictionary['projects']['items'][number];

export default function ProjectDetail({
  project,
  dictionary,
  lang,
}: {
  project: Project;
  dictionary: Dictionary;
  lang: string;
}) {
  const { detail, liveDemo, viewCode } = dictionary.projects;

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh' }}>
      <AmbientBackground />
      <CursorGlow />
      <Box
        component="main"
        sx={{
          position: 'relative',
          zIndex: 1,
          color: 'text.primary',
          minHeight: '100vh',
          py: { xs: 6, md: 10 },
        }}
      >
        <Container maxWidth="md">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {/* Back to home */}
            <motion.div variants={staggerItem}>
              <Button
                component={Link}
                href={`/${lang}`}
                startIcon={<ArrowBackIcon />}
                color="primary"
                sx={{ mb: 4, textTransform: 'none' }}
              >
                {detail.backToHome}
              </Button>
            </motion.div>

            {/* Header: title + summary */}
            <motion.div variants={staggerItem}>
              <Typography
                component="h1"
                variant="h3"
                sx={{ fontWeight: 800 }}
              >
                {project.title}
              </Typography>
            </motion.div>
            <motion.div variants={staggerItem}>
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{ mt: 2, mb: 5, lineHeight: 1.6, fontWeight: 400 }}
              >
                {project.summary}
              </Typography>
            </motion.div>

            {/* Screenshot carousel */}
            {project.screenshots.length > 0 ? (
              <motion.div variants={fadeUp}>
                <Box sx={{ mb: 6 }}>
                  <ScreenshotCarousel
                    screenshots={project.screenshots}
                    label={project.title}
                  />
                </Box>
              </motion.div>
            ) : null}

            {/* External links */}
            <motion.div variants={staggerItem}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 8 }}>
                <Button
                  variant="contained"
                  size="large"
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  startIcon={<LanguageIcon />}
                  sx={{ px: 3, py: 1.25 }}
                >
                  {liveDemo}
                </Button>
                {project.githubUrl ? (
                  <Button
                    variant="outlined"
                    size="large"
                    color="secondary"
                    href={project.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    startIcon={<GitHubIcon />}
                    sx={{ px: 3, py: 1.25 }}
                  >
                    {viewCode}
                  </Button>
                ) : null}
              </Box>
            </motion.div>
          </motion.div>

          {/* Overview / long description */}
          <Box component="section" sx={{ mb: 8 }}>
            <SectionHeading title={detail.overview} gutterBottomSpacing={3} />
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
            >
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ lineHeight: 1.8, fontSize: '1.05rem' }}
              >
                {project.longDescription}
              </Typography>
            </motion.div>
          </Box>

          {/* Highlights */}
          {project.highlights.length > 0 ? (
            <Box component="section" sx={{ mb: 8 }}>
              <SectionHeading title={detail.highlights} gutterBottomSpacing={3} />
              <TiltCard maxTilt={4}>
                <Card>
                  <CardContent>
                    <List disablePadding>
                      {project.highlights.map((highlight) => (
                        <ListItem key={highlight} disableGutters alignItems="flex-start">
                          <ListItemIcon sx={{ minWidth: 40, mt: 0.5 }}>
                            <CheckCircleOutlineIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText primary={highlight} />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </TiltCard>
            </Box>
          ) : null}

          {/* Technologies */}
          {project.techStack.length > 0 ? (
            <Box component="section">
              <SectionHeading title={detail.technologies} gutterBottomSpacing={3} />
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
              >
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {project.techStack.map((tech) => (
                    <motion.div key={tech} variants={staggerItem}>
                      <Chip label={tech} color="secondary" variant="outlined" />
                    </motion.div>
                  ))}
                </Box>
              </motion.div>
            </Box>
          ) : null}
        </Container>
      </Box>
    </Box>
  );
}
