'use client';
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Container from '@mui/material/Container';
import TranslateIcon from '@mui/icons-material/Translate';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Dictionary } from '../get-dictionary';

export default function Header({
  dictionary,
  toggleColorMode,
  mode,
}: {
  dictionary: Dictionary;
  toggleColorMode: () => void;
  mode: 'light' | 'dark';
}) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const pathName = usePathname();
  const router = useRouter();

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLangChange = (newLang: string) => {
    handleClose();
    if (!pathName) return;
    const segments = pathName.split('/');
    segments[1] = newLang;
    router.push(segments.join('/'));
  };

  return (
    <AppBar position="sticky" color="inherit" sx={{ bgcolor: 'background.default', backgroundImage: 'none', boxShadow: 'none', borderBottom: 1, borderColor: 'divider' }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, fontWeight: 700, color: 'text.primary' }}
          >
            Vinícius Albuquerque
          </Typography>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
            {['home', 'skills', 'projects', 'experience', 'contact'].map((item) => (
              <Button
                key={item}
                href={`#${item}`}
                sx={{ color: 'text.primary', '&:hover': { bgcolor: 'action.hover' } }}
                component={Link}
              >
                {dictionary.navigation[item as keyof Dictionary['navigation']]}
              </Button>
            ))}
          </Box>

          <Box sx={{ ml: 2, display: 'flex', gap: 1 }}>
            <IconButton onClick={toggleColorMode} color="inherit">
              {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
            <IconButton
              size="large"
              aria-label="change language"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <TranslateIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={() => handleLangChange('en')}>English</MenuItem>
              <MenuItem onClick={() => handleLangChange('pt')}>Português</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
