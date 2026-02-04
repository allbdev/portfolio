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
import { Dictionary } from '../get-dictionary';

export default function Experience({ dictionary }: { dictionary: Dictionary }) {
  return (
    <Box id="experience" component="section" sx={{ py: 10, bgcolor: 'background.paper' }}>
      <Container maxWidth="lg">
        <Typography variant="h3" component="h2" gutterBottom sx={{ mb: 6, fontWeight: 700 }}>
          {dictionary.experience.title}
        </Typography>
        
        <Box sx={{ maxWidth: 800, mx: 'auto' }}>
          <Stepper orientation="vertical">
            {dictionary.experience.jobs.map((job: Dictionary['experience']['jobs'][number]) => (
              <Step key={job.role} active={true}>
                <StepLabel
                  StepIconProps={{
                    sx: { color: 'primary.main' }
                  }}
                >
                  <Box>
                    <Typography variant="h6" fontWeight="bold" component="span">
                      {job.role}
                    </Typography>
                    <Typography variant="subtitle1" component="span" color="primary" sx={{ ml: 1 }}>
                      @ {job.company}
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    {job.period}
                  </Typography>
                </StepLabel>
                <StepContent>
                   <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                   >
                     <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.default', mb: 2 }}>
                        <Typography paragraph>{job.description}</Typography>
                        <Box component="ul" sx={{ pl: 2, m: 0 }}>
                          {job.achievements.map((achievement, i) => (
                            <li key={i}>
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
           <Typography variant="h4" component="h3" gutterBottom sx={{ mb: 4, fontWeight: 700 }}>
            {dictionary.experience.educationTitle}
           </Typography>
           <Grid container spacing={3}>
             {dictionary.experience.education.map((edu: Dictionary['experience']['education'][number]) => (
               <Grid key={edu.title} size={{ xs: 12, md: 6 }}>
                  <Paper elevation={1} sx={{ p: 3, height: '100%' }}>
                     <Typography variant="h6" gutterBottom>{edu.title}</Typography>
                     <Typography variant="subtitle2" color="primary" gutterBottom>{edu.institution}</Typography>
                     <Typography variant="body2" color="text.secondary">{edu.description}</Typography>
                  </Paper>
               </Grid>
             ))}
           </Grid>
        </Box>
      </Container>
    </Box>
  );
}
