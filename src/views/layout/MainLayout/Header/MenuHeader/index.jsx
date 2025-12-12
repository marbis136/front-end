import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Box,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  Typography
} from "@mui/material";
import menuItems from "../../../../../menu-items/index1"; // 👈 tu index.js que junta dashboard, pages, ventas, user, etc.

export default function MenuHeader() {
  // Controla qué grupo está abierto
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
            <Button
              variant="text"
              color="inherit"
              onClick={(e) => handleOpen(e, group)}
              sx={{ textTransform: "none", fontWeight: 500 }}
            >
              {group.title}
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={activeGroup?.id === group.id}
              onClose={handleClose}
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
                        <ListItemIcon>
                          <item.icon size={20} />
                        </ListItemIcon>
                      )}
                      <Typography>{item.title}</Typography>
                    </MenuItem>
                  );
                }
                // Si hay colapsables (subniveles), los podrías mapear aquí
                return null;
              })}
            </Menu>
          </Box>
        ) : null
      )}
    </Box>
  );
}
