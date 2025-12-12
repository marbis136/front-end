import PropTypes from 'prop-types';
import { Link, matchPath, useLocation } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import { useGetMenuMaster } from '../../../../../api/menu';
import useConfig from '../../../../../hooks/useConfig';

// fallback icon
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

export default function NavItem({ item }) {
  const theme = useTheme();
  const { pathname } = useLocation();
  const { borderRadius } = useConfig();
  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster.isDashboardDrawerOpened;

  // ✅ Verificación segura: solo hacer matchPath si hay url o link
  const pathToMatch = item?.link || item?.url;
  const isSelected = pathToMatch
    ? !!matchPath({ path: pathToMatch, end: false }, pathname)
    : false;

  const Icon = item?.icon;
  const itemIcon = Icon ? (
    <Icon stroke={1.5} size="20px" />
  ) : (
    <FiberManualRecordIcon sx={{ width: 6, height: 6 }} />
  );

  // colores dinámicos
  const primaryMain = theme.palette.primary.main;
  const primaryLight = theme.palette.primary.lighter || theme.palette.primary.light;

  return (
    <Tooltip title={!drawerOpen ? item.title : ''} placement="right">
      <ListItemButton
        component={Link}
        to={item.url || '#'}
        selected={isSelected}
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
          '&.Mui-selected': {
            bgcolor: primaryLight,
            color: primaryMain,
            '&:hover': { bgcolor: primaryLight }
          },
          '&:hover': {
            bgcolor: theme.palette.action.hover,
            color: primaryMain
          }
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: 0,
            justifyContent: 'center',
            color: isSelected ? primaryMain : theme.palette.text.secondary,
            mr: drawerOpen ? 2 : 0
          }}
        >
          {itemIcon}
        </ListItemIcon>

        {drawerOpen ? (
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <ListItemText
              primary={
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: isSelected ? 600 : 400,
                    color: isSelected ? primaryMain : theme.palette.text.primary
                  }}
                >
                  {item.title}
                </Typography>
              }
            />
            {item.chip && (
              <Chip
                label={item.chip.label}
                color={item.chip.color || 'default'}
                size="small"
                sx={{ height: 20, fontSize: '0.7rem', ml: 0.5 }}
              />
            )}
          </Box>
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
            {item.title}
          </Typography>
        )}
      </ListItemButton>
    </Tooltip>
  );
}

NavItem.propTypes = { item: PropTypes.any };
