import { useContext } from "react";
import { IconButton, Tooltip } from "@mui/material";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { ConfigContext } from "../../../../../contexts/ConfigContext";

export default function ModeToggle({ size = "medium" }) {
  const { mode, onToggleMode } = useContext(ConfigContext);
  const isDark = mode === 'dark';
  return (
    <Tooltip title={isDark ? "Cambiar a claro" : "Cambiar a oscuro"}>
      <IconButton onClick={onToggleMode} size={size}>
        {isDark ? <LightModeIcon /> : <DarkModeIcon />}
      </IconButton>
    </Tooltip>
  );
}
