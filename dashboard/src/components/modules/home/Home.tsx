import { Box, Typography, Button } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';

type SessionProps = {
  session?: {
    isAuth: boolean;
    userId: number | undefined;
    username: string | undefined;
  } | null;
};

const Home= ({ session }: SessionProps) => { 


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

        {session && 
          <Typography variant="h6" sx={{ mb: 3 }}>
            {`Welcome ${session.username} !`}
          </Typography> }
        <Typography variant="h6" sx={{ mb: 3 }}>
          This application is open-source and collaborative.
        </Typography>

        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={<GitHubIcon />}
          href="https://github.com/amrit-eu"
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
