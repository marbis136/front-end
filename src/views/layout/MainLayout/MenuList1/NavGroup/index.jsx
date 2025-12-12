import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import NavItem from '../NavItem';
import { useGetMenuMaster } from '../../../../../api/menu';

export default function NavGroup({ group }) {
  const theme = useTheme();
  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster.isDashboardDrawerOpened;

  return (
    <>
      <List
        disablePadding
        subheader={
          drawerOpen && group.title && (
            <Typography
              variant="overline"
              sx={{
                color: theme.palette.text.disabled,
                fontWeight: 600,
                letterSpacing: '0.08em',
                pl: 2.2,
                pb: 0.5,
                pt: 1.5,
                textTransform: 'uppercase'
              }}
            >
              {group.title}
            </Typography>
          )
        }
      >
        {group.children?.map((item) => (
          <NavItem key={item.id} item={item} />
        ))}
      </List>
      {drawerOpen && <Divider sx={{ my: 1, opacity: 0.4 }} />}
    </>
  );
}

NavGroup.propTypes = { group: PropTypes.object };
