// material-ui
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import MuiTypography from '@mui/material/Typography';

// project imports
import SubCard from '../../../../ui-component/cards/SubCard';
import MainCard from '../../../../ui-component/cards/MainCard';
import SecondaryAction from '../../../../ui-component/cards/CardSecondaryAction';
import { gridSpacing } from '../../../../store/constant';
import Menu from '../components/menu'
import PrecioMenu from '../components/preciomenu'
import IngredienteMenu from '../components/ingredientesmenu'
import SubclasificacionesMenu from '../components/subclasificacionmenu'

// ==============================|| TYPOGRAPHY ||============================== //

export default function Typography() {
  return (
    <MainCard title="Basic Typography" secondary={<SecondaryAction link="https://next.material-ui.com/system/typography/" />}>
      <Grid container spacing={gridSpacing}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Menu />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <PrecioMenu />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <IngredienteMenu />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <SubclasificacionesMenu />
        </Grid>
      </Grid>
    </MainCard>
  );
}
