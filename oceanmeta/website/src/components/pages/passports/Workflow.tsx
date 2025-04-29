import { Box, Typography, Grid, Paper } from '@mui/material';
import { PageProps } from '../PageProps';

const steps = [
  {
    title: '1. Setup Environment',
    description: `Contact OceanOPS to setup your permissions: support@ocean-ops.org
They will assign you a role within an official OceanOPS Program.
If required, they will create a new program for you.`,
    imgSrc: '/meta/img/setup.png',
  },
  {
    title: '2. Pre-registration',
    description: `Pre-register a mission to obtain a WIGOS-ID with only a few attributes.
This can be done via API or within the OceanOPS dashboard.
The WIGOS-ID will expire after 6 months if the record is not completed.`,
    imgSrc: '/meta/img/pre_reg.png',
  },
  {
    title: '3. Obtain Passport',
    description: `Submit metadata gradually to OceanOPS (File Upload or Forms).
Or setup an ERDDAP to allow OceanOPS to harvest your metadata.
When all the mandatory criteria are met, the passport will be granted.
The passport guarantees the mission adheres to GOOS objectives.`,
    imgSrc: '/meta/img/passportFlat.png',
  },
];

const SubmitPlatforms: React.FC<PageProps> = ({ darkMode }) => {
  return (
    <Box sx={{ paddingTop: 4 }}>
      <Typography
        variant="h2"
        sx={{
          fontWeight: 500,
          color: darkMode ? "#03a9f4" : "#009af4",
          textAlign: 'center',
          mb: 6,
          fontFamily: 'Montserrat',
        }}
      >
        How to request passorts ?
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        {steps.map((step, index) => (
          <Grid item xs={12}  key={index} >
            <Paper
              sx={{
                padding: 3,
                backgroundColor: darkMode ? '#2c2c2c' : '#fff',
                borderRadius: 2,
                boxShadow: 3,
				maxWidth: "1000px",
				marginLeft: 'auto', 
				marginRight: 'auto' 
              }}
            >
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={3}>
                  <Box
                    component="img"
                    src={step.imgSrc}
                    alt={step.title}
                    sx={{
                      width: '100%',
                      height: 'auto',
                      maxHeight: 150,
                      objectFit: 'contain',
                    }}
                  />
                </Grid>

                <Grid item xs={9}>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 600,
                      color: darkMode ? '#03a9f4' : '#009af4',
                      fontFamily: 'Montserrat',
                      mb: 2,
                    }}
                  >
                    {step.title}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '1.1rem',
                      color: darkMode ? '#e0e0e0' : '#333',
                      fontFamily: 'Montserrat',
                      lineHeight: 1.9,
                      whiteSpace: 'pre-line', // Ensures line breaks are respected
                    }}
                  >
                    {step.description}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default SubmitPlatforms;
