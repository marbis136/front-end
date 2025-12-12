// material-ui
import { useState, useContext } from 'react';
import { useTheme } from '@mui/material/styles';
import { AppBar, Toolbar, IconButton, Typography, Avatar, Box, useMediaQuery } from '@mui/material';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';

// project imports
import LogoSection from './LogoSection';
import ModeToggle from '../../../pages/Login/components/ModeToggle';
import MenuHeader from '../MenuList/MenuHeader';
import ProfileSection from './ProfileSection';
import NotificationSection from './NotificationSection';
import SettingsDrawer from './SettingsDrawer';

import { handlerDrawerOpen, useGetMenuMaster } from '../../../../api/menu';

// assets
import { IconMenu2 } from '@tabler/icons-react';

// ==============================|| MAIN NAVBAR / HEADER ||============================== //

export default function Header() {
  const theme = useTheme();
  const downMD = useMediaQuery(theme.breakpoints.down('md'));

  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster.isDashboardDrawerOpened;
  const [openSettings, setOpenSettings] = useState(false);

  return (
    <>
      {/* logo & toggler button */}
      <Box sx={{ width: downMD ? 'auto' : 230, display: 'flex' }}>
        <Box component="span" sx={{ display: { xs: 'none', md: 'block' }, flexGrow: 1 }}>
          <LogoSection />
        </Box>
        <Avatar
          variant="rounded"
          sx={{
            ...theme.typography.commonAvatar,
            ...theme.typography.mediumAvatar,
            overflow: 'hidden',
            transition: 'all .2s ease-in-out',
            bgcolor: 'secondary.light',
            color: 'secondary.dark',
            '&:hover': {
              bgcolor: 'secondary.dark',
              color: 'secondary.light'
            }
          }}
          onClick={() => handlerDrawerOpen(!drawerOpen)}
          color="inherit"
        >
          <IconMenu2 stroke={1.5} size="20px" />
        </Avatar>
      </Box>

      {/* Espaciador para empujar MenuHeader al centro */}
      <Box sx={{ flexGrow: 1 }} />

      {/* MenuHeader centrado */}
      <Box sx={{ display: 'flex', justifyContent: 'center', flexGrow: 0 }}>
        <MenuHeader />
      </Box>

      {/* Espaciador para empujar el resto a la derecha */}
      <Box sx={{ flexGrow: 1 }} />

      {/* 👇 Aquí tu switch de modo */}
      <ModeToggle size="small" />

      {/* notification */}
      <NotificationSection />

      {/* profile */}
      <ProfileSection />
      <IconButton onClick={() => setOpenSettings(true)}>
        <SettingsOutlinedIcon />
      </IconButton>
      <SettingsDrawer open={openSettings} onClose={() => setOpenSettings(false)} />
    </>
  );
}
