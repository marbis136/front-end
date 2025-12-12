
// material-ui
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import MuiTypography from '@mui/material/Typography';

// project imports
import SubCard from 'ui-component/cards/SubCard';

export default function IngredienteMenu() {
  return (
    <SubCard title="Body">
            <Grid container direction="column" spacing={1}>
              <Grid>
                <MuiTypography variant="body1" gutterBottom>
                  body1. Lorem ipsum dolor sit connecter adieu siccing eliot. Quos blanditiis tenetur unde suscipit, quam beatae rerum
                  inventore consectetur, neque doloribus, cupiditate numquam dignissimos laborum fugiat deleniti? Eum quasi quidem
                  quibusdam.
                </MuiTypography>
              </Grid>
              <Grid>
                <MuiTypography variant="body2" gutterBottom>
                  body2. Lorem ipsum dolor sit connecter adieu siccing eliot. Quos blanditiis tenetur unde suscipit, quam beatae rerum
                  inventore consectetur, neque doloribus, cupiditate numquam dignissimos laborum fugiat deleniti? Eum quasi quidem
                  quibusdam.
                </MuiTypography>
              </Grid>
            </Grid>
          </SubCard>
  )
}
