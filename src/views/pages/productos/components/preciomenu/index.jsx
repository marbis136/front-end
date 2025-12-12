// material-ui
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import MuiTypography from '@mui/material/Typography';

// project imports
import SubCard from '../../../../../ui-component/cards/SubCard';

export default function PrecioMenu() {
  return (
    <SubCard title="Sub title">
            <Grid container direction="column" spacing={1}>
              <Grid>
                <MuiTypography variant="subtitle1" gutterBottom>
                  subtitle1. Lorem ipsum dolor sit connecter adieu siccing eliot. Quos blanditiis tenetur
                </MuiTypography>
              </Grid>
              <Grid>
                <MuiTypography variant="subtitle2" gutterBottom>
                  subtitle2. Lorem ipsum dolor sit connecter adieu siccing eliot. Quos blanditiis tenetur
                </MuiTypography>
              </Grid>
            </Grid>
          </SubCard>
  )
}
