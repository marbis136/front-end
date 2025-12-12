import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { matchPath, useLocation } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import Collapse from '@mui/material/Collapse';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project imports
import NavItem from '../NavItem';
import useConfig from '../../../../../hooks/useConfig';
import { useGetMenuMaster } from '../../../../../api/menu';
import FloatingSubmenu from "../FloatingSubmenu";

// assets
import { IconChevronDown, IconChevronRight, IconChevronUp } from '@tabler/icons-react';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

export default function NavCollapse({ menu, level, parentId }) {
  const theme = useTheme();
  const ref = useRef(null);
  const { borderRadius } = useConfig();
  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster.isDashboardDrawerOpened;

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  const primaryMain = theme.palette.primary.main;
  const primaryLight = theme.palette.primary.light;
  const textPrimary = theme.palette.text.primary;
  const textSecondary = theme.palette.text.secondary;

  const { pathname } = useLocation();

  const handleClickMini = (event) => {
    if (drawerOpen) {
      setOpen(!open);
      setSelected(!selected ? menu.id : null);
    } else {
      setAnchorEl(event.currentTarget);
    }
  };

  const openMini = Boolean(anchorEl);
  const handleClosePopper = () => setAnchorEl(null);

  useEffect(() => {
    if (menu.children) {
      menu.children.forEach((item) => {
        if (item.url === pathname || (item.link && !!matchPath({ path: item.link, end: false }, pathname))) {
          setSelected(menu.id);
          setOpen(true);
        }
      });
    }
  }, [pathname, menu]);

  const menus = menu.children?.map((item) => {
    switch (item.type) {
      case 'collapse':
        return <NavCollapse key={item.id} menu={item} level={level + 1} parentId={parentId} />;
      case 'item':
        return <NavItem key={item.id} item={item} level={level + 1} />;
      default:
        return (
          <Typography key={item.id} variant="h6" color="error" align="center">
            Menu Items Error
          </Typography>
        );
    }
  });

  const isSelected = selected === menu.id;
  const Icon = menu.icon;
  const menuIcon = Icon ? (
    <Icon strokeWidth={1.5} size={drawerOpen ? '20px' : '22px'} />
  ) : (
    <FiberManualRecordIcon sx={{ width: 6, height: 6 }} />
  );

  const collapseIcon = drawerOpen ? (
    <IconChevronUp stroke={1.5} size="16px" />
  ) : (
    <IconChevronRight stroke={1.5} size="16px" />
  );

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: !drawerOpen ? 'column' : 'row',
          alignItems: 'center',
          justifyContent: drawerOpen ? 'flex-start' : 'center',
          mb: 0.5
        }}
      >
        <ListItemButton
          onClick={handleClickMini}
          sx={{
            borderRadius: `${borderRadius}px`,
            flexDirection: drawerOpen ? 'row' : 'column',
            alignItems: 'center',
            justifyContent: 'center',
            py: drawerOpen ? 1 : 0.5,
            color: isSelected ? primaryMain : textPrimary,
            '&:hover': { bgcolor: primaryLight, color: primaryMain },
            '&.Mui-selected': { bgcolor: primaryLight, color: primaryMain }
          }}
          selected={isSelected}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mb: !drawerOpen ? 0.5 : 0,
              color: isSelected ? primaryMain : textPrimary,
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            {menuIcon}
          </ListItemIcon>

          {drawerOpen ? (
            <ListItemText
              primary={
                <Typography
                  variant={isSelected ? 'h6' : 'body1'}
                  sx={{
                    fontWeight: isSelected ? 600 : 400,
                    color: isSelected ? primaryMain : textPrimary
                  }}
                >
                  {menu.title}
                </Typography>
              }
            />
          ) : (
            <Typography
              variant="caption"
              sx={{
                fontSize: '0.7rem',
                textAlign: 'center',
                color: textSecondary,
                whiteSpace: 'nowrap'
              }}
            >
              {menu.title}
            </Typography>
          )}
        </ListItemButton>

        {drawerOpen && collapseIcon}
      </Box>

      {/* Submenú expandido (Drawer abierto) */}
      {drawerOpen && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List
            disablePadding
            sx={{
              position: 'relative',
              '&:after': {
                content: "''",
                position: 'absolute',
                left: '25px',
                top: 0,
                height: '100%',
                width: '1px',
                bgcolor: primaryLight
              }
            }}
          >
            {menus}
          </List>
        </Collapse>
      )}

      {/* Submenú flotante (modo mini) */}
      {!drawerOpen && (
        <FloatingSubmenu
          open={openMini}
          anchorEl={anchorEl}
          onClose={handleClosePopper}
          menus={menus}
        />
      )}
    </>
  );
}

NavCollapse.propTypes = {
  menu: PropTypes.any,
  level: PropTypes.number,
  parentId: PropTypes.string
};
