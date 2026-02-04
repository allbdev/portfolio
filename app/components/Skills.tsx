'use client';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';

const MotionCard = motion(Card);

import { Dictionary } from '../get-dictionary';

export default function Skills({ dictionary }: { dictionary: Dictionary }) {
  return (
    <Box id="skills" component="section" sx={{ py: 10, bgcolor: 'background.paper' }}>
      <Container maxWidth="lg">
        <Typography variant="h3" component="h2" gutterBottom sx={{ mb: 6, fontWeight: 700 }}>
          {dictionary.skills.title}
        </Typography>
        <Grid container spacing={4}>
          {dictionary.skills.items.map((skill: Dictionary['skills']['items'][number], index: number) => (
            <Grid key={skill.name} size={{ xs: 12, sm: 6, md: 4 }}>
              <MotionCard
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                sx={{ height: '100%' }}
              >
                <CardContent>
                  <Typography variant="h6" component="h3" gutterBottom color="primary.main">
                    {skill.name}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {skill.description}
                  </Typography>
                </CardContent>
              </MotionCard>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
