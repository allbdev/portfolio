import Link from 'next/link';
import ThemeRegistry from '../../../components/ThemeRegistry/ThemeRegistry';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

export default function ProjectNotFound() {
  return (
    <ThemeRegistry>
      <Box
        component="main"
        sx={{
          minHeight: '100vh',
          color: 'text.primary',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Container maxWidth="sm" sx={{ textAlign: 'center' }}>
          <Typography variant="h3" component="h1" sx={{ fontWeight: 700 }}>
            404
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }} color="text.secondary">
            Project not found. / Projeto não encontrado.
          </Typography>
          <Typography variant="body1" sx={{ mt: 4, color: 'primary.main' }}>
            <Link href="/" style={{ color: 'inherit' }}>
              ← Home
            </Link>
          </Typography>
        </Container>
      </Box>
    </ThemeRegistry>
  );
}
