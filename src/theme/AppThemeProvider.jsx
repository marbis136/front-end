import PropTypes from "prop-types";
import { useContext, useMemo } from "react";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { ConfigContext } from "contexts/ConfigContext";

export default function AppThemeProvider({ children }) {
  const { mode, fontFamily, borderRadius, primaryColor, secondaryColor } = useContext(ConfigContext);

  const theme = useMemo(() => createTheme({
    palette: {
      mode,
      primary: { main: primaryColor },
      secondary: { main: secondaryColor }
    },
    shape: { borderRadius },
    typography: { fontFamily },
    components: {
      MuiDrawer: { styleOverrides: { paper: { backgroundImage: 'none' } } },
      MuiAppBar: { styleOverrides: { colorInherit: { backgroundImage: 'none' } } },
      MuiPaper: { defaultProps: { elevation: 1 } }
    }
  }), [mode, fontFamily, borderRadius, primaryColor, secondaryColor]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
AppThemeProvider.propTypes = { children: PropTypes.node };
