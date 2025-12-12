// material-ui
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import MuiTypography from '@mui/material/Typography';

// project imports
import SubCard from '../../../../../ui-component/cards/SubCard';

export default function SubclasificacionesMenu() {
  return (
    <SubCard title="Extra">
            <Grid container direction="column" spacing={1}>
              <Grid>
                <MuiTypography variant="button" gutterBottom sx={{ display: 'block' }}>
                  button text
                </MuiTypography>
              </Grid>
              <Grid>
                <MuiTypography variant="caption" gutterBottom sx={{ display: 'block' }}>
                  caption text
                </MuiTypography>
              </Grid>
              <Grid>
                <MuiTypography variant="overline" gutterBottom sx={{ display: 'block' }}>
                  overline text
                </MuiTypography>
              </Grid>
              <Grid>
                <MuiTypography
                  variant="body2"
                  color="primary"
                  component={Link}
                  href="https://berrydashboard.com"
                  target="_blank"
                  underline="hover"
                  gutterBottom
                  sx={{ display: 'block' }}
                >
                  https://berrydashboard.com
                </MuiTypography>
              </Grid>
            </Grid>
          </SubCard>
  )
}
