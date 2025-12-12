import { Link as RouterLink } from 'react-router-dom';
import { Typography, Box, Link } from '@mui/material';
import logoMana from '../../../../../assets/logo.png';

export default function LogoSection() {
  return (
    <Link
      component={RouterLink}
      to="/dashboard" // 👈 aquí va la ruta como string
      underline="none"
      aria-label="theme-logo"
      sx={{ display: 'inline-flex', alignItems: 'center' }}
    >
      <Box component="img" src={logoMana} alt="Pizzería El Mana" sx={{ width: 40, height: 40, borderRadius: 1, mr: 1 }} />
      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          whiteSpace: 'nowrap',
          display: { xs: 'none', sm: 'block' },
          color: 'text.primary'
        }}
      >
        EL MANA
      </Typography>
    </Link>
  );
}
