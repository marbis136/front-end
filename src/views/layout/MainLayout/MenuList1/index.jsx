import { memo, useState } from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

// project imports
import NavItem from './NavItem';
import NavGroup from './NavGroup';
import menuItems from '../../../../menu-items';
import { useGetMenuMaster } from '../../../../api/menu';

// ==============================|| SIDEBAR MENU LIST ||============================== //

function MenuList() {
  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster.isDashboardDrawerOpened;

  const [selectedID, setSelectedID] = useState('');

  // si tienes varios grupos, cada uno se renderiza con su título (como OVERVIEW, MANAGEMENT)
  const navItems = menuItems.items.map((menuGroup, index) => {
    switch (menuGroup.type) {
      case 'group':
        return (
          <Box key={menuGroup.id} sx={{ mb: 1.5 }}>
            <NavGroup
              group={menuGroup}
              setSelectedID={setSelectedID}
              selectedID={selectedID}
            />
            {/* separador visual entre grupos */}
            {drawerOpen && index < menuItems.items.length - 1 && (
              <Divider sx={{ my: 1, opacity: 0.5 }} />
            )}
          </Box>
        );

      case 'item':
        return (
          <List key={menuGroup.id}>
            <NavItem item={menuGroup} level={1} isParents setSelectedID={() => setSelectedID('')} />
            {index !== 0 && <Divider sx={{ py: 0.5 }} />}
          </List>
        );

      default:
        return (
          <Typography key={menuGroup.id} variant="h6" color="error" align="center">
            Menu Items Error
          </Typography>
        );
    }
  });

  return (
    <Box
      sx={{
        mt: drawerOpen ? 1.5 : 0,
        px: drawerOpen ? 1 : 0,
        overflowX: 'hidden',
        overflowY: 'auto',
        '&::-webkit-scrollbar': { width: 4 },
        '&::-webkit-scrollbar-thumb': {
          bgcolor: 'divider',
          borderRadius: 2
        }
      }}
    >
      {navItems}
    </Box>
  );
}

export default memo(MenuList);
