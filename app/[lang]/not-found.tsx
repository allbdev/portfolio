import Link from 'next/link';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { i18n } from '../../i18n-config';

export default function NotFound() {
  return (
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
          Page not found. / Página não encontrada.
        </Typography>
        <Typography variant="body1" sx={{ mt: 4, color: 'primary.main' }}>
          <Link href={`/${i18n.defaultLocale}`} style={{ color: 'inherit' }}>
            ← Home
          </Link>
        </Typography>
      </Container>
    </Box>
  );
}
