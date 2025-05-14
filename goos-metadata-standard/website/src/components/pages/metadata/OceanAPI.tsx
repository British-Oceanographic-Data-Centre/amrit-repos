import { Box, Typography } from '@mui/material';
import { PageProps } from '../PageProps';

const OceanAPI: React.FC<PageProps> = ({ darkMode }) => {
  return (
	<Box sx={{ textAlign: 'center', mb: 4 }}>
	<Typography variant="h2" sx={{ fontWeight: 500, color: darkMode ? "#03a9f4" : "#009af4" }}>
	  Ocean
	  <Typography variant="h2" component="span" sx={{ fontWeight: '600' }}>
		API
	  </Typography>
	</Typography>
	<Typography variant="h5" sx={{ fontWeight: 400, color: darkMode ? "#e0e0e0" : "#333" }}>
	The OceanMeta API.
	</Typography>
	<br/><br/>
	OceanAPI currently doesn't handle OceanJSON export.<br/>
	  This functionality is coming soon and will be documented here.<br/>
	  In the meantime, the API documentation is <a target="_blank" href="https://www.ocean-ops.org/api/help/">here</a>
  </Box>
  );
};

export default OceanAPI;
