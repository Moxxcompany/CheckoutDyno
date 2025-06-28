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
import Notification from "@/assets/Icons/Nitification";
import User from '@/assets/Images/user.png';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';


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
          backgroundImage: `url('/wave.png'), linear-gradient(90deg, #101EF7 0%, #4B50E6 50%, #7C5CF0 100%)`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'top right',
          backgroundSize: 'contain, cover',
          padding: '0.5rem 1rem',
          boxShadow: 'none',
        }}


      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {/* Left: Logo */}
          <Box display='flex' alignItems='center' gap={1}>
            <Image src='/Logo.png' alt='Dynopay' width={180} height={60} />
          </Box>

          {/* Right: Menu or Full Actions */}
          {isMobile ? (
            <IconButton onClick={toggleDrawer} sx={{ color: 'white' }}>
              <MenuIcon />
            </IconButton>
          ) : (
            <Stack direction='row' spacing={3} alignItems='center'>
              <Button
                startIcon={<AccountBalanceWalletIcon />}
                variant='contained'
                sx={{
                  backgroundColor: 'white',
                  color: '#2b3bcf',
                  borderRadius: 20,
                  px: 2,
                  py: 2,
                  right: "117px",
                  textTransform: 'none',
                  fontFamily: "Space Grotesk",
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
                    fontFamily: 'Space Grotesk',
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
                  justifyContent: 'space-between',
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
                    backgroundColor: !darkMode ?'#444CE7' :'#fff',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    color: 'white',
                    transition: 'all 0.3s ease',
                    padding:'4px'

                  }}
                >
                  <WbSunnyIcon fontSize='small' sx={{
                    color: darkMode ? '#444CE7' : '#fff',
                    width:'100%'
                  }} />
                </Box>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    backgroundColor: darkMode ?'#444CE7' :'#fff',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    color: 'white',
                    transition: 'all 0.3s ease',
                    padding:'4px'
                  }}
                >
                  <BedtimeIcon sx={{
                    color: darkMode ? '#fff' : '#444CE7',
                    width:'100%'
                  }} fontSize='small' />
                </Box>
              </Box>

              {/* Notifications */}
              <IconButton sx={{ color: 'white' }}>
                <Badge
                  variant="dot"
                  sx={{
                    '& .MuiBadge-dot': {
                      backgroundColor: '#444CE7',
                    },
                  }}
                >
                  <Notification />
                </Badge>

              </IconButton>

              {/* Avatar */}
              <Box position='relative'>
                <Avatar
                  sx={{ bgcolor: 'white', color: '#2b3bcf', width: 48, height: 48 }}
                >
                  <img src={User.src} alt='User' width={28} height={28} />
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
            <Button startIcon={<AccountBalanceWalletIcon />}>Dynopay Wallet</Button>
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
              <Notification />
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
