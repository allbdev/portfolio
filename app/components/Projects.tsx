'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Chip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import GitHubIcon from '@mui/icons-material/GitHub';
import LanguageIcon from '@mui/icons-material/Language';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { cardHover, staggerContainer, staggerItem } from './motion/variants';
import SectionHeading from './SectionHeading';
import TiltCard from './TiltCard';
import { Dictionary } from '../get-dictionary';
import { i18n } from '../../i18n-config';

const MotionCard = motion(Card);

export default function Projects({ dictionary }: { dictionary: Dictionary }) {
  const pathName = usePathname();
  const lang = pathName?.split('/')[1] || i18n.defaultLocale;

  return (
    <Box id="projects" component="section" sx={{ py: 10 }}>
      <Container maxWidth="lg">
        <SectionHeading title={dictionary.projects.title} />
        <Grid
          container
          spacing={4}
          component={motion.div}
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          {dictionary.projects.items.map((project: Dictionary['projects']['items'][number]) => (
            <Grid key={project.title} size={{ xs: 12, md: 6 }} component={motion.div} variants={staggerItem}>
              <TiltCard maxTilt={6}>
                <MotionCard
                  variants={cardHover}
                  initial="rest"
                  whileHover="hover"
                  whileTap="tap"
                  sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
                      {project.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" paragraph>
                      {project.description}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 2 }}>
                      {project.techStack.map((tech) => (
                        <Chip key={tech} label={tech} size="small" color="secondary" variant="outlined" />
                      ))}
                    </Box>
                  </CardContent>
                  <CardActions sx={{ p: 2, pt: 0, gap: 0.5, alignItems: 'center' }}>
                    <Tooltip title={dictionary.projects.liveDemo}>
                      <IconButton color="primary" href={project.liveUrl} target="_blank" rel="noreferrer">
                        <LanguageIcon />
                      </IconButton>
                    </Tooltip>
                    {project.githubUrl ? (
                      <Tooltip title={dictionary.projects.viewCode}>
                        <IconButton color="primary" href={project.githubUrl} target="_blank" rel="noreferrer">
                          <GitHubIcon />
                        </IconButton>
                      </Tooltip>
                    ) : null}
                    <Button
                      component={Link}
                      href={`/${lang}/projeto/${project.slug}`}
                      color="primary"
                      variant="outlined"
                      size="small"
                      endIcon={<ArrowForwardIcon />}
                      sx={{ ml: 'auto' }}
                    >
                      {dictionary.projects.viewDetails}
                    </Button>
                  </CardActions>
                </MotionCard>
              </TiltCard>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
