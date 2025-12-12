import PropTypes from 'prop-types';
import { useMemo } from 'react';

// material-ui
import { createTheme, ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// project imports
import useConfig from '../hooks/useConfig';
import Palette from './palette';
import Typography from './typography';
import customShadows from './shadows';
import componentStyleOverrides from './compStyleOverride';

// ==============================|| THEME CUSTOMIZATION WRAPPER ||============================== //

export default function ThemeCustomization({ children }) {
  // 🔹 Tomamos toda la configuración desde el contexto
  let {
    mode = 'light',
    presetColor = '#7367F0',
    skin = 'default',
    semiDark = false,
    borderRadius = 8,
    fontFamily = "'Inter', system-ui, sans-serif",
    outlinedFilled = true
  } = useConfig();

  // ⚙️ Corrige el modo "system" para MUI (elige según el sistema operativo)
  if (mode === 'system') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    mode = prefersDark ? 'dark' : 'light';
  }

  // ======================================================
  // 🎨 PALETA BASE
  // ======================================================
  const baseTheme = useMemo(() => Palette(mode, presetColor, skin, semiDark), [mode, presetColor, skin, semiDark]);

  // ======================================================
  // ✍️ TIPOGRAFÍA Y SOMBRAS
  // ======================================================
  const themeTypography = useMemo(() => Typography(baseTheme, borderRadius, fontFamily), [baseTheme, borderRadius, fontFamily]);
  const themeCustomShadows = useMemo(() => customShadows(mode, baseTheme), [mode, baseTheme]);

  // ======================================================
  // ⚙️ OPCIONES DEL TEMA
  // ======================================================
  const themeOptions = useMemo(
    () => ({
      direction: 'ltr',
      palette: baseTheme.palette,
      shape: { borderRadius },
      typography: themeTypography,
      customShadows: themeCustomShadows,
      mixins: {
        toolbar: {
          minHeight: 48,
          padding: '16px',
          '@media (min-width:600px)': {
            minHeight: 48
          }
        }
      }
    }),
    [baseTheme, borderRadius, themeTypography, themeCustomShadows]
  );

  // ======================================================
  // 🧱 CREAR THEME FINAL + OVERRIDES
  // ======================================================
  const themes = useMemo(() => {
    const created = createTheme(themeOptions);
    created.components = componentStyleOverrides(created, borderRadius, outlinedFilled);
    return created;
  }, [themeOptions, borderRadius, outlinedFilled]);

  // ======================================================
  // 🧩 PROVIDER
  // ======================================================
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={themes}>
        <CssBaseline enableColorScheme />
        {children}
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

ThemeCustomization.propTypes = { children: PropTypes.node };
