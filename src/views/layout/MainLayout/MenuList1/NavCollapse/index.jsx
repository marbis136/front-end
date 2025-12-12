import PropTypes from 'prop-types';
import { useState, useEffect, useRef } from 'react';
import { matchPath, useLocation, Link } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Collapse from '@mui/material/Collapse';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';

// icons
import { IconChevronDown, IconChevronRight } from '@tabler/icons-react';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

// project imports
import NavItem from '../NavItem';
import Transitions from '../../../../../ui-component/extended/Transitions';
import { useGetMenuMaster } from '../../../../../api/menu';
import useConfig from '../../../../../hooks/useConfig';

export default function NavCollapse({ menu, level = 1 }) {
  const theme = useTheme();
  const ref = useRef(null);
  const { pathname } = useLocation();
  const { borderRadius } = useConfig();
  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster.isDashboardDrawerOpened;

  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const openMini = Boolean(anchorEl);
  const hasChildren = menu.children && menu.children.length > 0;

  // Si solo tiene un hijo, lo tratamos como un item directo
  const isSingleChild = hasChildren && menu.children.length === 1;

  // Detectar si está seleccionado
  const isSelected =
    !!matchPath({ path: menu?.url || '', end: false }, pathname) ||
    menu.children?.some((child) => matchPath({ path: child.url || '', end: false }, pathname));

  const primaryMain = theme.palette.primary.main;
  const primaryLight = theme.palette.primary.lighter || theme.palette.primary.light;

  const Icon = menu.icon;
  const menuIcon = Icon ? (
    <Icon strokeWidth={1.5} size="20px" />
  ) : (
    <FiberManualRecordIcon sx={{ width: isSelected ? 8 : 6, height: isSelected ? 8 : 6 }} />
  );

  // ---- HANDLERS ----
  const handleClick = (event) => {
    if (isSingleChild) return; // no expandir si solo tiene uno
    if (drawerOpen) setOpen((prev) => !prev);
    else setAnchorEl(event.currentTarget);
  };

  const handleClosePopper = () => {
    setAnchorEl(null);
  };

  // ---- RENDER CHILDREN ----
  const menus = hasChildren
    ? menu.children.map((item) =>
        item.type === 'collapse' ? (
          <NavCollapse key={item.id} menu={item} level={level + 1} />
        ) : (
          <NavItem key={item.id} item={item} />
        )
      )
    : null;

  // ---- EFFECTS ----
  useEffect(() => {
    setOpen(false);
    setAnchorEl(null);
  }, [pathname]);

  return (
    <>
      <Tooltip title={!drawerOpen ? menu.title : ''} placement="right">
        <ListItemButton
          onClick={handleClick}
          component={isSingleChild ? Link : 'div'}
          to={isSingleChild ? menu.children[0].url : undefined}
          sx={{
            flexDirection: drawerOpen ? 'row' : 'column',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: `${borderRadius}px`,
            textAlign: 'center',
            py: drawerOpen ? 1 : 1.5,
            mb: 0.5,
            transition: 'all 0.25s ease-in-out',
            color: isSelected ? primaryMain : theme.palette.text.secondary,
            bgcolor: isSelected ? primaryLight : 'transparent',
            '&:hover': {
              bgcolor: theme.palette.action.hover,
              color: primaryMain
            }
          }}
          {...(!drawerOpen && {
            onMouseEnter: (e) => !isSingleChild && setAnchorEl(e.currentTarget),
            onMouseLeave: handleClosePopper
          })}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              justifyContent: 'center',
              color: isSelected ? primaryMain : theme.palette.text.secondary,
              mr: drawerOpen ? 2 : 0
            }}
          >
            {menuIcon}
          </ListItemIcon>

          {drawerOpen ? (
            <ListItemText
              primary={
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: isSelected ? 600 : 400,
                    color: isSelected ? primaryMain : theme.palette.text.primary
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
                mt: 0.5,
                fontSize: '0.7rem',
                fontWeight: isSelected ? 600 : 400,
                color: isSelected ? primaryMain : theme.palette.text.secondary
              }}
            >
              {menu.title}
            </Typography>
          )}

          {hasChildren && drawerOpen && (
            <Box sx={{ ml: 'auto', color: theme.palette.text.secondary }}>
              {open ? <IconChevronDown size="16px" /> : <IconChevronRight size="16px" />}
            </Box>
          )}
        </ListItemButton>
      </Tooltip>

      {/* --- SUBMENÚS EN DRAWER ABIERTO --- */}
      {drawerOpen && hasChildren && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding sx={{ pl: 3 }}>
            {menus}
          </List>
        </Collapse>
      )}

      {/* --- POPOVER PARA MINI DRAWER --- */}
      {!drawerOpen && hasChildren && !isSingleChild && (
        <Popper
          open={openMini}
          anchorEl={anchorEl}
          placement="right-start"
          disablePortal
          sx={{ zIndex: 2001 }}
        >
          <Transitions in={openMini}>
            <Paper
              sx={{
                boxShadow: theme.shadows[8],
                mt: 1,
                borderRadius: 2,
                minWidth: 180,
                backgroundColor: theme.palette.background.paper
              }}
            >
              <ClickAwayListener onClickAway={handleClosePopper}>
                <Box>{menus}</Box>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        </Popper>
      )}
    </>
  );
}

NavCollapse.propTypes = {
  menu: PropTypes.object,
  level: PropTypes.number
};
