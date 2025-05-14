import { createTheme } from '@mui/material/styles';

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
  },
	typography: {
		fontFamily: 'Montserrat, sans-serif',
		h1: {
			fontWeight: 600, 
		},
		h2: {
			fontWeight: 600, 
		},
		h3: {
			fontWeight: 600, 
		},
		body1: {
			fontWeight: 400, 
		},
		body2: {
			fontWeight: 300, 
		},
	},
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
  },
  
  typography: {
		fontFamily: 'Montserrat, sans-serif',
		h1: {
			fontWeight: 600, 
		},
		h2: {
			fontWeight: 600,
		},
		h3: {
			fontWeight: 600,
		},
		body1: {
			fontWeight: 400, 
		},
		body2: {
			fontWeight: 300,
		},
	},
});
