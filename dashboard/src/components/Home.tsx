import { Box, Typography, Button } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';

const Home: React.FC = () => {

  return (
    <Box
      sx={{
        height: 'calc(100vh - 124px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        px: 2,
        textAlign: 'center',
        maxWidth: '1200px',
        mx: 'auto',
      }}
    >
      <Box sx={{ width: '100%', maxWidth: '700px', mb: 4 }}>
        <Box component="img"
          src="/favicon.png"
          alt="AMRIT logo"
          sx={{
            height: 96,
            mb: 2,

          }}
        />

        <Typography variant="h6" sx={{ mb: 3 }}>
          OceanBoards is a collaborative AMRIT project.
        </Typography>

        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={<GitHubIcon />}
          href="https://github.com/British-Oceanographic-Data-Centre/amrit-repos"
          target="_blank"
          rel="noopener noreferrer"
        >
          Join us on GitHub
        </Button>
      </Box>
    </Box>
  );
};

export default Home;
