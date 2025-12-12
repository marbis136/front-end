import { useEffect, useRef, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Avatar,
  Card,
  CardContent,
  Chip,
  ClickAwayListener,
  Divider,
  Grid,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Popper,
  Stack,
  Switch,
  Typography,
  Box,
  Button
} from '@mui/material';

// project imports
import MainCard from '../../../../../ui-component/cards/MainCard';
import Transitions from '../../../../../ui-component/extended/Transitions';
import useConfig from '../../../../../hooks/useConfig';
import { useAuth } from '../../../../../auth/AuthContext';

// assets
import User1 from '../../../../../assets/images/users/user-round.svg';
import { IconLogout, IconUser } from '@tabler/icons-react';

// ==============================|| PROFILE MENU ||============================== //

export default function ProfileSection() {
  const theme = useTheme();
  const { borderRadius } = useConfig();
  const { user, logout } = useAuth();

  const [sdm, setSdm] = useState(true);
  const [notification, setNotification] = useState(false);
  const [selectedIndex] = useState(-1);
  const [open, setOpen] = useState(false);

  const anchorRef = useRef(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }
    prevOpen.current = open;
  }, [open]);

  return (
    <>
      {/* Chip con avatar + nombre de usuario */}
      <Chip
        sx={{
          ml: 2,
          height: '48px',
          alignItems: 'center',
          borderRadius: '27px',
          '& .MuiChip-label': {
            lineHeight: 0
          }
        }}
        icon={
          <Avatar
            src={user?.foto || User1}
            alt={user?.nombre || 'user-avatar'}
            sx={{
              ...theme.typography.mediumAvatar,
              margin: '8px 0 8px 8px !important',
              cursor: 'pointer'
            }}
            ref={anchorRef}
            aria-controls={open ? 'menu-list-grow' : undefined}
            aria-haspopup="true"
            color="inherit"
          />
        }
        label={
          <Typography component="span" variant="h4" sx={{ fontWeight: 400 }}>
            {user?.nombre || 'Usuario'}
          </Typography>
        }
        ref={anchorRef}
        aria-controls={open ? 'menu-list-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
        color="primary"
        aria-label="user-account"
      />

      {/* Menú desplegable */}
      <Popper
        placement="bottom"
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        modifiers={[
          {
            name: 'offset',
            options: {
              offset: [0, 14]
            }
          }
        ]}
      >
        {({ TransitionProps }) => (
          <ClickAwayListener onClickAway={handleClose}>
            <Transitions in={open} {...TransitionProps}>
              <Paper>
                {open && (
                  <MainCard border={false} elevation={16} content={false} boxShadow shadow={theme.shadows[16]}>
                    <Box sx={{ p: 2, pb: 0 }}>
                      <Stack>
                        <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
                          <Typography variant="h4">Bienvenido:</Typography>
                          <Typography component="span" variant="h4" sx={{ fontWeight: 400 }}>
                            {`${user?.nombre || ''} ${user?.apellido_paterno || ''} ${user?.apellido_materno || ''}`.trim() || 'Usuario'}
                          </Typography>
                        </Stack>
                        <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
                          <Typography variant="h4">ROL:</Typography>
                          <Typography variant="subtitle2">{user?.rol || 'Sin rol'}</Typography>
                        
                        </Stack>
                        <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
                          
                          <Typography variant="h4">ALMACEN:</Typography>
                          <Typography variant="subtitle2">{user?.almacen || 'Sin tipo almacen'}</Typography>
                        </Stack>
                      </Stack>

                      {/* 👇 Botones de acción */}
                      <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                        <Button variant="outlined" size="small" color="primary">
                          Cambiar Foto
                        </Button>
                        <Button variant="outlined" size="small" color="secondary">
                          Cambiar Contraseña
                        </Button>
                      </Stack>

                      <Divider sx={{ mt: 2 }} />
                    </Box>

                    {/* Contenido */}
                    <Box
                      sx={{
                        p: 2,
                        py: 0,
                        height: '100%',
                        maxHeight: 'calc(100vh - 250px)',
                        overflowX: 'hidden',
                        '&::-webkit-scrollbar': { width: 5 }
                      }}
                    >
                      <Divider />
                      <Card sx={{ bgcolor: 'primary.light', my: 2 }}>
                        <CardContent>
                          <Grid container spacing={3} direction="column">
                            <Grid>
                              <Grid container sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                                <Grid>
                                  <Typography variant="subtitle1">Modo DND</Typography>
                                </Grid>
                                <Grid>
                                  <Switch
                                    color="primary"
                                    checked={sdm}
                                    onChange={(e) => setSdm(e.target.checked)}
                                    name="sdm"
                                    size="small"
                                  />
                                </Grid>
                              </Grid>
                            </Grid>
                            <Grid>
                              <Grid container sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                                <Grid>
                                  <Typography variant="subtitle1">Permitir notificaciones</Typography>
                                </Grid>
                                <Grid>
                                  <Switch
                                    checked={notification}
                                    onChange={(e) => setNotification(e.target.checked)}
                                    name="notification"
                                    size="small"
                                  />
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                      <Divider />

                      {/* Opciones */}
                      <List
                        component="nav"
                        sx={{
                          width: '100%',
                          maxWidth: 350,
                          minWidth: 300,
                          borderRadius: `${borderRadius}px`,
                          '& .MuiListItemButton-root': { mt: 0.5 }
                        }}
                      >
                        <ListItemButton sx={{ borderRadius: `${borderRadius}px` }} selected={selectedIndex === 1}>
                          <ListItemIcon>
                            <IconUser stroke={1.5} size="20px" />
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Grid container spacing={1} sx={{ justifyContent: 'space-between' }}>
                                <Grid>
                                  <Typography variant="body2">Perfil Social</Typography>
                                </Grid>
                                <Grid>
                                  <Chip
                                    label="02"
                                    variant="filled"
                                    size="small"
                                    color="warning"
                                    sx={{ '& .MuiChip-label': { mt: 0.25 } }}
                                  />
                                </Grid>
                              </Grid>
                            }
                          />
                        </ListItemButton>

                        {/* Logout */}
                        <ListItemButton sx={{ borderRadius: `${borderRadius}px` }} onClick={logout}>
                          <ListItemIcon>
                            <IconLogout stroke={1.5} size="20px" />
                          </ListItemIcon>
                          <ListItemText primary={<Typography variant="body2">Cerrar sesión</Typography>} />
                        </ListItemButton>
                      </List>
                    </Box>
                  </MainCard>
                )}
              </Paper>
            </Transitions>
          </ClickAwayListener>
        )}
      </Popper>
    </>
  );
}
