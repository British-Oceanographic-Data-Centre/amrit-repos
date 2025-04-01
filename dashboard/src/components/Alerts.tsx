import { Box, Typography } from '@mui/material';

const Home: React.FC = () => {

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 2,
      paddingBottom: 0,
      textAlign: 'center',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
		
		  <Box sx={{ marginTop: 0, width: '100%', maxWidth: '600px', mt: 4 }}>
        <Typography variant="h5" sx={{ marginTop: 0, marginBottom: 0, marginRight: 0 }}>
          Alerts dashboard
        </Typography>
      </Box>

    </Box>
  );
};

export default Home;
