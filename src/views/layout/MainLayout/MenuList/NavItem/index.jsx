import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { Link, matchPath, useLocation } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Avatar from '@mui/material/Avatar';
import ButtonBase from '@mui/material/ButtonBase';
import Chip from '@mui/material/Chip';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

// project imports
import { handlerDrawerOpen, useGetMenuMaster } from '../../../../../api/menu';
import useConfig from '../../../../../hooks/useConfig';

// assets
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

export default function NavItem({ item, level, isParents = false, setSelectedID }) {
  const theme = useTheme();
  const downMD = useMediaQuery(theme.breakpoints.down('md'));
  const ref = useRef(null);

  const { pathname } = useLocation();
  const { borderRadius } = useConfig();
  const { menuMaster } = useGetMenuMaster();

  const drawerOpen = menuMaster.isDashboardDrawerOpened;

  // ✅ Manejo seguro de ruta
  const pathToMatch = item?.link || item?.url;
  const isSelected = pathToMatch
    ? !!matchPath({ path: pathToMatch, end: false }, pathname)
    : false;

  const [hoverStatus, setHover] = useState(false);
  const compareSize = () => {
    const compare = ref.current && ref.current.scrollWidth > ref.current.clientWidth;
    setHover(compare);
  };

  useEffect(() => {
    compareSize();
    window.addEventListener('resize', compareSize);
    window.removeEventListener('resize', compareSize);
  }, []);

  const Icon = item?.icon;
  const itemIcon = Icon ? (
    <Icon stroke={1.5} size={drawerOpen ? '20px' : '24px'} />
  ) : (
    <FiberManualRecordIcon
      sx={{ width: isSelected ? 8 : 6, height: isSelected ? 8 : 6 }}
      fontSize={level > 0 ? 'inherit' : 'medium'}
    />
  );

  const itemTarget = item.target ? '_blank' : '_self';

  const itemHandler = () => {
    if (downMD) handlerDrawerOpen(false);
    if (isParents && setSelectedID) setSelectedID();
  };

  // 🎨 Colores dinámicos desde la paleta
  const primaryMain = theme.palette.primary.main;
  const primaryLight = theme.palette.primary.light;
  const textPrimary = theme.palette.text.primary;

  return (
    <ListItemButton
      component={Link}
      to={item.url || '#'}
      target={itemTarget}
      disabled={item.disabled}
      disableRipple={!drawerOpen}
      selected={isSelected}
      onClick={itemHandler}
      sx={{
        zIndex: 1201,
        borderRadius: `${borderRadius}px`,
        mb: 0.5,
        flexDirection: drawerOpen ? 'row' : 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        py: drawerOpen ? 0.5 : 1,
        transition: 'all 0.25s ease-in-out',
        color: isSelected ? primaryMain : textPrimary,
        bgcolor: isSelected ? primaryLight : 'transparent',
        '&:hover': {
          bgcolor: theme.palette.action.hover,
          color: primaryMain
        },
        '&.Mui-selected': {
          bgcolor: primaryLight,
          color: primaryMain,
          '&:hover': { bgcolor: primaryLight }
        }
      }}
    >
      <ButtonBase
        aria-label="theme-icon"
        sx={{ borderRadius: `${borderRadius}px` }}
        disableRipple={drawerOpen}
      >
        <ListItemIcon
          sx={{
            minWidth: level === 1 ? 36 : 18,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isSelected ? primaryMain : 'text.primary'
          }}
        >
          {itemIcon}
        </ListItemIcon>
      </ButtonBase>

      {/* ✅ Texto debajo cuando el menú está mini */}
      {!drawerOpen ? (
        <Typography
          variant="caption"
          sx={{
            mt: 0.5,
            fontSize: '0.7rem',
            fontWeight: isSelected ? 600 : 400,
            color: isSelected ? primaryMain : theme.palette.text.secondary
          }}
        >
          {item.title}
        </Typography>
      ) : (
        <Tooltip title={item.title} disableHoverListener={!hoverStatus}>
          <ListItemText
            primary={
              <Typography
                ref={ref}
                noWrap
                variant={isSelected ? 'h5' : 'body1'}
                color={isSelected ? primaryMain : textPrimary}
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  width: 120
                }}
              >
                {item.title}
              </Typography>
            }
          />
        </Tooltip>
      )}

      {/* Chip opcional */}
      {drawerOpen && item.chip && (
        <Chip
          color={item.chip.color}
          variant={item.chip.variant}
          size={item.chip.size}
          label={item.chip.label}
          avatar={item.chip.avatar && <Avatar>{item.chip.avatar}</Avatar>}
        />
      )}
    </ListItemButton>
  );
}

NavItem.propTypes = {
  item: PropTypes.any,
  level: PropTypes.number,
  isParents: PropTypes.bool,
  setSelectedID: PropTypes.func
};
