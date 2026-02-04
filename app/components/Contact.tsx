import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { Dictionary } from '../get-dictionary';

export default function Contact({ dictionary }: { dictionary: Dictionary }) {
  return (
    <Box id="contact" component="section" sx={{ py: 10 }}>
      <Container maxWidth="md">
        <Typography variant="h3" component="h2" align="center" gutterBottom sx={{ mb: 2, fontWeight: 700 }}>
          {dictionary.contact.title}
        </Typography>
        <Typography variant="h6" align="center" color="text.secondary" paragraph sx={{ mb: 6 }}>
          {dictionary.contact.subtitle}
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3, justifyContent: 'center' }}>
          <Button 
            variant="contained" 
            size="large" 
            href={dictionary.contact.links.email}
            sx={{ px: 4, py: 1.5 }}
          >
            Email
          </Button>
          <Button 
            variant="outlined" 
            size="large" 
            href={dictionary.contact.links.linkedin}
            target="_blank"
            sx={{ px: 4, py: 1.5 }}
          >
            LinkedIn
          </Button>
          <Button 
            variant="outlined" 
            size="large" 
            href={dictionary.contact.links.github}
            target="_blank"
            sx={{ px: 4, py: 1.5 }}
          >
            GitHub
          </Button>
        </Box>
        
        <Box component="footer" sx={{ mt: 10, textAlign: 'center', borderTop: 1, borderColor: 'divider', pt: 4 }}>
           <Typography variant="body2" color="text.secondary">
             {dictionary.contact.copyright}
           </Typography>
        </Box>
      </Container>
    </Box>
  );
}
