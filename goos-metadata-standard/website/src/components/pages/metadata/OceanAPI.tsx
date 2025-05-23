import { Box, Typography } from '@mui/material';
import { PageProps } from '../PageProps';

const OceanAPI: React.FC<PageProps> = ({ darkMode }) => {
  return (
	<Box sx={{ textAlign: 'center', mb: 4 }}>
	<Typography variant="h2" sx={{ fontWeight: 500, color: darkMode ? "#03a9f4" : "#009af4" }}>
	  API
	  <Typography variant="h2" component="span" sx={{ fontWeight: '600' }}>
		
	  </Typography>
	</Typography>
	<Typography variant="h5" sx={{ fontWeight: 400, color: darkMode ? "#e0e0e0" : "#333" }}>
	API Endpoints for Passport metadata.
	</Typography>
	<br/><br/>
	The passport API will ingest and serve Passport JSON.<br/>
	  This functionality is coming soon and will be documented here.<br/>
  </Box>
  );
};

export default OceanAPI;
