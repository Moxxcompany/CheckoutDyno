'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Drawer,
  Stack,
  Select,
  MenuItem,
  FormControl,
  Avatar,
  Badge,
  Button,
  useMediaQuery,
  useTheme
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNone';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import BedtimeIcon from '@mui/icons-material/Bedtime';
import CreditCardIcon from '@mui/icons-material/CreditCard';

import User from '@/assets/Images/user.png';

const Header = ({
  darkMode,
  toggleDarkMode
}: {
  darkMode: boolean;
  toggleDarkMode: () => void;
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <>
      <AppBar
        position='static'
        sx={{
          background: 'linear-gradient(to right, #2b3bcf, #4b50e6)',
          padding: '0.5rem 1rem',
          boxShadow: 'none'
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {/* Left: Logo */}
          <Box display='flex' alignItems='center' gap={1}>
            <Image src='/Logo.png' alt='Dynopay' width={100} height={32} />
          </Box>

          {/* Right: Menu or Full Actions */}
          {isMobile ? (
            <IconButton onClick={toggleDrawer} sx={{ color: 'white' }}>
              <MenuIcon />
            </IconButton>
          ) : (
            <Stack direction='row' spacing={3} alignItems='center'>
              <Button
                startIcon={<CreditCardIcon />}
                variant='contained'
                sx={{
                  backgroundColor: 'white',
                  color: '#2b3bcf',
                  borderRadius: 20,
                  px: 2,
                  py: 2,
                  right:30,
                  textTransform: 'none',
                  fontWeight: 'bold',
                  boxShadow: 'none',
                  '&:hover': {
                    backgroundColor: '#f5f5f5'
                  }
                }}
              >
                Dynopay Wallet
              </Button>

              <FormControl variant='standard'>
                <Select
                  defaultValue='EN'
                  disableUnderline
                  sx={{
                    color: 'white',
                    fontWeight: 600,
                    '& .MuiSvgIcon-root': { color: 'white' }
                  }}
                >
                  <MenuItem value='EN'>EN</MenuItem>
                  <MenuItem value='FR'>FR</MenuItem>
                </Select>
              </FormControl>

              {/* Theme Toggle */}
              <Box
                onClick={toggleDarkMode}
                sx={{
                  width: 80,
                  height: 40,
                  backgroundColor: 'white',
                  borderRadius: 999,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: darkMode ? 'flex-end' : 'flex-start',
                  px: 0.5,
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  transition: 'all 0.3s ease'
                }}
              >
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    backgroundColor: '#444CE7',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {darkMode ? <WbSunnyIcon fontSize='small' /> : <BedtimeIcon fontSize='small' />}
                </Box>
              </Box>

              {/* Notifications */}
              <IconButton sx={{ color: 'white' }}>
                <Badge variant='dot' color='primary'>
                  <NotificationsNoneOutlinedIcon />
                </Badge>
              </IconButton>

              {/* Avatar */}
              <Box position='relative'>
                <Avatar
                  sx={{ bgcolor: 'white', color: '#2b3bcf', width: 48, height: 48 }}
                >
                  <img src={User.src} alt='User' />
                </Avatar>
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 4,
                    right: 2,
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    backgroundColor: '#12B76A',
                    border: '2px solid white'
                  }}
                />
              </Box>
            </Stack>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer anchor='right' open={drawerOpen} onClose={toggleDrawer}>
        <Box sx={{ width: 250, p: 2 }}>
          <Stack spacing={2}>
            <Button startIcon={<CreditCardIcon />}>Dynopay Wallet</Button>
            <FormControl variant='standard'>
              <Select defaultValue='EN'>
                <MenuItem value='EN'>EN</MenuItem>
                <MenuItem value='FR'>FR</MenuItem>
              </Select>
            </FormControl>
            <Box
              onClick={toggleDarkMode}
              sx={{
                width: 60,
                height: 30,
                backgroundColor: 'white',
                borderRadius: 999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: darkMode ? 'flex-end' : 'flex-start',
                px: 0.5,
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                transition: 'all 0.3s ease'
              }}
            >
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  backgroundColor: '#444CE7',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  transition: 'all 0.3s ease'
                }}
              >
                {darkMode ? <WbSunnyIcon fontSize='small' /> : <BedtimeIcon fontSize='small' />}
              </Box>
            </Box>
            {/* <IconButton>
              <NotificationsNoneOutlinedIcon />
            </IconButton> */}
            {/* <Avatar sx={{ width: 40, height: 40 }}>
              <img src={User.src} alt='User' />
            </Avatar> */}
          </Stack>
        </Box>
      </Drawer>
    </>
  );
};

export default Header;
