// material-ui
import { alpha } from '@mui/material/styles';

function createCustomShadow(theme, baseColor) {
  const transparent = alpha(baseColor, 0.24);
  const safe = (c) => (c ? c : '#000000');

  return {
    z1: `0 1px 2px 0 ${transparent}`,
    z8: `0 8px 16px 0 ${transparent}`,
    z12: `0 12px 24px 0 ${transparent}`,
    z16: `0 0 3px 0 ${transparent}`,
    z20: `0 0 3px 0 ${transparent}`,
    z24: `0 0 6px 0 ${transparent}`,

    primary: `0px 12px 14px 0px ${alpha(safe(theme.palette.primary.main), 0.3)}`,
    secondary: `0px 12px 14px 0px ${alpha(safe(theme.palette.secondary.main), 0.3)}`,
    orange: `0px 12px 14px 0px ${alpha(safe(theme.palette.orange?.main), 0.3)}`,
    success: `0px 12px 14px 0px ${alpha(safe(theme.palette.success.main), 0.3)}`,
    warning: `0px 12px 14px 0px ${alpha(safe(theme.palette.warning.main), 0.3)}`,
    error: `0px 12px 14px 0px ${alpha(safe(theme.palette.error.main), 0.3)}`
  };
}

export default function customShadows(mode, theme) {
  const baseColor = theme.palette.grey?.[900] || (mode === 'dark' ? '#fff' : '#000');
  return createCustomShadow(theme, baseColor);
}
