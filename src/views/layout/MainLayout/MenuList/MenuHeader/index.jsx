import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Box,
  ButtonBase,
  Menu,
  MenuItem,
  ListItemIcon,
  Typography,
  useTheme,
  Paper,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import menuItems from "../../../../../menu-items/index"; // 👈 tu index.js que une dashboard, pages, etc.

export default function MenuHeader() {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const [activeGroup, setActiveGroup] = useState(null);

  const handleOpen = (event, group) => {
    setAnchorEl(event.currentTarget);
    setActiveGroup(group);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setActiveGroup(null);
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
      {menuItems.items.map((group) =>
        group.children && group.children.length > 0 ? (
          <Box key={group.id}>
            {/* ======= BOTÓN PRINCIPAL ======= */}
            <ButtonBase
              onClick={(e) => handleOpen(e, group)}
              sx={{
                px: 2.5,
                py: 1,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                gap: 1,
                fontWeight: 500,
                color:
                  activeGroup?.id === group.id
                    ? theme.palette.primary.main
                    : theme.palette.text.secondary,
                backgroundColor:
                  activeGroup?.id === group.id
                    ? alpha(theme.palette.primary.light, 0.6)
                    : "transparent",
                "&:hover": {
                  backgroundColor: alpha(theme.palette.primary.light, 0.4),
                  color: theme.palette.primary.main,
                },
                transition: "all 0.25s ease-in-out",
              }}
            >
              {/* === Ícono al lado del texto === */}
              {group.icon && (
                <Box
                  component="span"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color:
                      activeGroup?.id === group.id
                        ? theme.palette.primary.main
                        : theme.palette.text.secondary,
                  }}
                >
                  <group.icon size={18} strokeWidth={1.7} />
                </Box>
              )}
              {/* === Texto del botón === */}
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  letterSpacing: 0.2,
                }}
              >
                {group.title}
              </Typography>
            </ButtonBase>

            {/* ======= SUBMENÚ ======= */}
            <Menu
              anchorEl={anchorEl}
              open={activeGroup?.id === group.id}
              onClose={handleClose}
              PaperProps={{
                component: Paper,
                sx: {
                  borderRadius: 2,
                  minWidth: 180,
                  mt: 1.2,
                  boxShadow: `0 6px 20px ${alpha(
                    theme.palette.primary.main,
                    0.15
                  )}`,
                  backgroundColor: theme.palette.background.paper,
                  "& .MuiMenuItem-root": {
                    fontSize: "0.9rem",
                    borderRadius: 1.5,
                    gap: 1,
                    px: 2,
                    color: theme.palette.text.primary,
                    "&:hover": {
                      backgroundColor: theme.palette.action.hover,
                      color: theme.palette.primary.main,
                    },
                  },
                },
              }}
              transformOrigin={{ horizontal: "left", vertical: "top" }}
              anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
            >
              {group.children.map((item) => {
                if (item.type === "item") {
                  return (
                    <MenuItem
                      key={item.id}
                      component={NavLink}
                      to={item.url}
                      onClick={handleClose}
                    >
                      {item.icon && (
                        <ListItemIcon
                          sx={{
                            minWidth: 32,
                            color: theme.palette.text.secondary,
                          }}
                        >
                          <item.icon size={18} strokeWidth={1.5} />
                        </ListItemIcon>
                      )}
                      <Typography variant="body2">{item.title}</Typography>
                    </MenuItem>
                  );
                }
                return null;
              })}
            </Menu>
          </Box>
        ) : null
      )}
    </Box>
  );
}
