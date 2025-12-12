import { useContext } from "react";
import {
  Drawer,
  Box,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  Slider,
  IconButton,
  Switch,
  Divider,
  Grid
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { ConfigContext } from "../../../../../contexts/ConfigContext";

// ======================================================
// 🔹 Colores primarios
// ======================================================
const COLORS = [
  { label: "Purple", value: "#7367F0" },
  { label: "Green", value: "#28C76F" },
  { label: "Red", value: "#EA5455" },
  { label: "Orange", value: "#FF9F43" },
  { label: "Orange", value: "#ff008cff" },
  { label: "Blue", value: "#00CFE8" }
];

// ======================================================
// 🔹 Fuentes disponibles
// ======================================================
const FONTS = [
  { label: "Inter", value: "'Inter', system-ui, Avenir, Helvetica, Arial, sans-serif" },
  { label: "Poppins", value: "'Poppins', sans-serif" },
  { label: "Roboto", value: "'Roboto','Helvetica','Arial',sans-serif" }
];

export default function SettingsDrawer({ open, onClose }) {
  const {
    mode,
    onSetMode,
    fontFamily,
    onChangeFontFamily,
    borderRadius,
    onChangeBorderRadius,
    presetColor,
    onChangePresetColor,
    layout,
    onChangeLayout,
    contentWidth,
    onChangeContentWidth,
    skin,
    onChangeSkin,
    semiDark,
    onChangeSemiDark
  } = useContext(ConfigContext);

  return (
    <Drawer anchor="right" open={open} onClose={onClose}
      slotProps={{ paper: { sx: { width: 380 } } }}>
      {/* ================= HEADER ================= */}
      <Box sx={{
        p: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: 1,
        borderColor: "divider"
      }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          Theme Customizer
        </Typography>
        <IconButton onClick={onClose}><CloseIcon /></IconButton>
      </Box>

      <Box sx={{ p: 2 }}>
        {/* ======================================================
            🎨 THEMING SECTION
        ====================================================== */}
        <Typography variant="overline" sx={{ color: "text.secondary" }}>Primary Color</Typography>
        <Grid container spacing={1.5} sx={{ mt: 1 }}>
          {COLORS.map((c) => (
            <Grid item key={c.value}>
              <Box
                onClick={() => onChangePresetColor(c.value)}
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  cursor: "pointer",
                  bgcolor: c.value,
                  border: presetColor === c.value ? "3px solid #7367F0" : "2px solid transparent",
                  boxShadow: presetColor === c.value ? "0 0 0 3px rgba(115,103,240,0.2)" : "none",
                }}
              />
            </Grid>
          ))}
        </Grid>

        {/* Mode */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="overline" sx={{ color: "text.secondary" }}>Mode</Typography>
          <ToggleButtonGroup
            value={mode}
            exclusive
            onChange={(_, v) => v && onSetMode(v)}
            sx={{ mt: 1, display: "flex" }}
          >
            <ToggleButton value="light" sx={{ flex: 1 }}>Light</ToggleButton>
            <ToggleButton value="dark" sx={{ flex: 1 }}>Dark</ToggleButton>
            <ToggleButton value="system" sx={{ flex: 1 }}>System</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* Skin */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="overline" sx={{ color: "text.secondary" }}>Skin</Typography>
          <ToggleButtonGroup
            value={skin}
            exclusive
            onChange={(_, v) => v && onChangeSkin(v)}
            sx={{ mt: 1, display: "flex" }}
          >
            <ToggleButton value="default" sx={{ flex: 1 }}>Default</ToggleButton>
            <ToggleButton value="bordered" sx={{ flex: 1 }}>Bordered</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* Semi Dark */}
        <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="overline" sx={{ color: "text.secondary" }}>Semi Dark</Typography>
          <Switch checked={semiDark} onChange={(e) => onChangeSemiDark(e.target.checked)} />
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* ======================================================
            🧱 LAYOUT SECTION
        ====================================================== */}
        <Typography variant="overline" sx={{ color: "text.secondary" }}>Layout</Typography>
        <ToggleButtonGroup
          value={layout}
          exclusive
          onChange={(_, v) => v && onChangeLayout(v)}
          sx={{ mt: 1, display: "flex" }}
        >
          <ToggleButton value="vertical" sx={{ flex: 1 }}>Vertical</ToggleButton>
          <ToggleButton value="collapsed" sx={{ flex: 1 }}>Collapsed</ToggleButton>
          <ToggleButton value="horizontal" sx={{ flex: 1 }}>Horizontal</ToggleButton>
        </ToggleButtonGroup>

        <Box sx={{ mt: 3 }}>
          <Typography variant="overline" sx={{ color: "text.secondary" }}>Content Width</Typography>
          <ToggleButtonGroup
            value={contentWidth}
            exclusive
            onChange={(_, v) => v && onChangeContentWidth(v)}
            sx={{ mt: 1, display: "flex" }}
          >
            <ToggleButton value="compact" sx={{ flex: 1 }}>Compact</ToggleButton>
            <ToggleButton value="wide" sx={{ flex: 1 }}>Wide</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* ======================================================
            🖋️ FONT & BORDER
        ====================================================== */}
        <Typography variant="overline" sx={{ color: "text.secondary" }}>Font Style</Typography>
        <Box sx={{ mt: 1, display: "grid", gap: 1 }}>
          {FONTS.map((f) => (
            <ToggleButton
              key={f.value}
              value={f.value}
              selected={fontFamily === f.value}
              onChange={() => onChangeFontFamily(f.value)}
              sx={{
                justifyContent: "flex-start",
                borderRadius: 2,
                fontFamily: f.value,
                height: 44,
              }}
            >
              {f.label}
            </ToggleButton>
          ))}
        </Box>

        <Box sx={{ mt: 3 }}>
          <Typography variant="overline" sx={{ color: "text.secondary" }}>Border Radius</Typography>
          <Box sx={{ px: 0.5, mt: 2 }}>
            <Slider
              value={borderRadius}
              min={4}
              max={24}
              step={1}
              valueLabelDisplay="on"
              onChange={onChangeBorderRadius}
            />
            <Box sx={{ display: "flex", justifyContent: "space-between", color: "text.secondary" }}>
              <Typography variant="caption">4px</Typography>
              <Typography variant="caption">24px</Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
}
