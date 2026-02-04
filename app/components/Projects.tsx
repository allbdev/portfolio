'use client'
import Box from '@mui/material/Box';
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
import { motion } from 'framer-motion';

const MotionCard = motion(Card);

import { Dictionary } from '../get-dictionary';

export default function Projects({ dictionary }: { dictionary: Dictionary }) {
  return (
    <Box id="projects" component="section" sx={{ py: 10 }}>
      <Container maxWidth="lg">
        <Typography variant="h3" component="h2" gutterBottom sx={{ mb: 6, fontWeight: 700 }}>
          {dictionary.projects.title}
        </Typography>
        <Grid container spacing={4}>
          {dictionary.projects.items.map((project: Dictionary['projects']['items'][number], index: number) => (
            <Grid key={project.title} size={{ xs: 12, md: 6 }}>
              <MotionCard
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: index * 0.2 }}
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
                      <Chip key={tech} label={tech} size="small" />
                    ))}
                  </Box>
                </CardContent>
                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Tooltip title={dictionary.projects.liveDemo}>
                    <IconButton color="primary" href={project.liveUrl} target="_blank">
                      <LanguageIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={dictionary.projects.viewCode}>
                    <IconButton color="primary" href={project.githubUrl} target="_blank">
                      <GitHubIcon />
                    </IconButton>
                  </Tooltip>
                </CardActions>
              </MotionCard>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
