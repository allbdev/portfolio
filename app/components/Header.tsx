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
import { motion } from 'framer-motion';
import { headerBar } from './motion/variants';
import { Dictionary } from '../get-dictionary';

const MotionBox = motion(Box);

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
    <AppBar
      position="sticky"
      color="inherit"
      component={motion.nav}
      variants={headerBar}
      initial="hidden"
      animate="visible"
      sx={{
        bgcolor: (theme) =>
          theme.palette.mode === 'light' ? 'rgba(248, 250, 252, 0.85)' : 'rgba(11, 18, 32, 0.88)',
        backdropFilter: 'blur(12px)',
        backgroundImage: 'none',
        boxShadow: (theme) => `0 1px 0 ${theme.palette.divider}`,
        borderBottom: 1,
        borderColor: 'divider',
      }}
    >
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

          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 0.5, alignItems: 'center' }}>
            {['home', 'skills', 'projects', 'experience', 'contact'].map((item) => (
              <motion.div
                key={item}
                initial="rest"
                whileHover="hover"
                style={{ position: 'relative' }}
              >
                <Button
                  href={`#${item}`}
                  sx={{
                    color: 'text.primary',
                    '&:hover': { bgcolor: 'transparent', color: 'primary.main' },
                    transition: 'color 0.2s ease',
                    fontSize: '0.875rem',
                  }}
                  component={Link}
                >
                  {dictionary.navigation[item as keyof Dictionary['navigation']]}
                </Button>
                <MotionBox
                  variants={{
                    rest: { scaleX: 0, opacity: 0 },
                    hover: {
                      scaleX: 1,
                      opacity: 1,
                      transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] },
                    },
                  }}
                  sx={{
                    position: 'absolute',
                    bottom: 4,
                    left: 8,
                    right: 8,
                    height: '2px',
                    borderRadius: 999,
                    background: (theme) =>
                      `linear-gradient(90deg, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
                    transformOrigin: 'left',
                  }}
                />
              </motion.div>
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
