// Palette.js
// material-ui
import { createTheme, alpha } from '@mui/material/styles';
// util
import tinycolor from 'tinycolor2';
// (opcional) tu set de colores base SCSS, solo como respaldo para secundarios/estados
// E:\Mana Sytem\Mana Sytem\front end\src\assets\scss\_themes-vars.module.scss
import vars from '../assets/scss/_themes-vars.module.scss';

function makeScale(hex) {
  const c = tinycolor(hex);
  // ajusta porcentajes si quieres más/menos contraste
  const light = c.clone().lighten(18).toHexString();
  const dark = c.clone().darken(12).toHexString();
  // contraste AA básico entre texto y fondo del color
  const contrastText = c.isLight() ? '#111827' : '#ffffff';
  return { light, main: c.toHexString(), dark, contrastText };
}

function makeGrey(mode) {
  // grey neutro consistente
  return {
    50:  '#fafafa',
    100: '#f5f5f5',
    200: '#eeeeee',
    300: '#e0e0e0',
    400: '#bdbdbd',
    500: '#9e9e9e',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
    A100: mode === 'dark' ? '#2a2a2a' : '#f0f0f0'
  };
}

function backgroundByMode(mode, skin, semiDark) {
  if (mode === 'dark') {
    return {
      paper: semiDark ? '#1f1f1f' : '#121212',
      default: semiDark ? '#181818' : '#0a0a0a'
    };
  }
  return {
    paper: skin === 'bordered' ? '#f9fafb' : '#ffffff',
    default: '#f9fafb'
  };
}

export default function Palette(
  mode = 'light',
  presetColor = '#7367F0',
  skin = 'default',
  semiDark = false
) {
  // Primary dinámico a partir del preset
  const primary = makeScale(presetColor);

  // Puedes permitir también cambiar el secundario dinámicamente si lo deseas;
  // por ahora tomamos respaldo de tus variables SCSS o un fallback.
  const secondary = makeScale(vars?.secondaryMain || '#9c27b0');

  // Estados con respaldos
  const error = makeScale(vars?.errorMain || '#f44336');
  const warning = makeScale(vars?.warningMain || '#ff9800');
  const success = makeScale(vars?.successMain || '#4caf50');

  // “orange” explícito (lo usas en sombras)
  const orange = makeScale('#FB8C00');

  const grey = makeGrey(mode);
  const bg = backgroundByMode(mode, skin, semiDark);

  const textPrimary = mode === 'dark' ? '#ffffff' : '#212121';
  const textSecondary = mode === 'dark' ? '#e0e0e0' : '#424242';

  const paletteBase = {
    mode,
    common: { black: '#000', white: '#fff' },

    primary,
    secondary,
    error,
    warning,
    success,
    orange,

    grey,
    divider: mode === 'dark' ? alpha('#ffffff', 0.12) : grey[200],

    text: {
      primary: textPrimary,
      secondary: textSecondary,
      disabled: mode === 'dark' ? alpha('#ffffff', 0.38) : grey[500]
    },

    background: {
      paper: bg.paper,
      default: bg.default
    },

    // Aseguramos palette.action siempre definido
    action: {
      active: textPrimary,
      hover: mode === 'dark' ? alpha('#ffffff', 0.08) : alpha('#000000', 0.04),
      selected: mode === 'dark' ? alpha('#ffffff', 0.16) : alpha('#000000', 0.08),
      disabled: mode === 'dark' ? alpha('#ffffff', 0.3) : alpha('#000000', 0.26),
      disabledBackground: mode === 'dark' ? alpha('#ffffff', 0.12) : alpha('#000000', 0.12),
      focus: mode === 'dark' ? alpha('#ffffff', 0.12) : alpha('#000000', 0.12)
    }
  };

  return createTheme({ palette: paletteBase });
}
