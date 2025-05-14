import { Box, Typography, Grid } from '@mui/material';
import { PageProps } from '../PageProps';


const Passports: React.FC<PageProps> = ({ darkMode }) => {
  return (
    <Box sx={{ padding: 4, maxWidth: '1200px', textAlign: 'center', justifyContent: 'center' }}>
      <Typography variant="h2" sx={{ fontWeight: 500, color: darkMode ? "#03a9f4" : "#009af4", marginBottom: 2 }}>
        Passports
      </Typography>

      {/* Two Panels Above the Image */}
      <Grid container spacing={4} sx={{ marginBottom: 5, justifyContent: 'center',marginTop: 3 }}>
	  <Grid item xs={12} md={7}>
		<Box sx={{ padding: 1, borderRadius: 2 }}>
			<Grid container alignItems="center" spacing={2}>
			{/* Text Section */}
			<Grid item xs={12} md={7}>
				<Typography variant="h5" sx={{ fontSize: "1.2rem" }}>
				For each mission, OceanOPS issues a <strong>Platform Mission Passport</strong> with a unique identifier (WIGOS-ID).
				<br /><br /><br />
				A platform mission represents a defined period for an observing platform during which it collects and transmits data in alignment with GOOS objectives.
				</Typography>
			</Grid>

			{/* Image Section */}
			<Grid item xs={12} md={5} sx={{ display: 'flex', justifyContent: 'center' ,paddingRight: "0px" }}>
				<Box
				component="img"
				src="/meta/img/passport.png" // Update the path to your image
				alt="Passport"
				sx={{
					width: '180px', // Fixed width for the image
					height: 'auto', // Maintain aspect ratio
				}}
				/>
			</Grid>
			</Grid>
		</Box>
		</Grid>
        <Grid item xs={12} md={5}>
          <Box sx={{ padding: 1, borderRadius: 2 }}>
            <Typography variant="h5" sx={{fontSize: "1.15rem"}}>
              Just like a passport tracks a person’s identity, movements, and official records, the Platform Mission Passport serves as a comprehensive record of an observing platform’s journey throughout its mission lifecycle.
              <br /><br />
              It provides a globally recognized identity (WIGOS-ID) and ensures that every deployment is properly documented from preparation to termination.
            </Typography>
          </Box>
        </Grid>
      </Grid>

      {/* Centered Image */}
      <Box sx={{ display: 'flex', justifyContent: 'center', marginY: 4 }}>
        <Box
          component="img"
          src="/meta/img/passport_concept_map.png"
          alt="Passport Concept Map"
          sx={{ width: '100%', height: 'auto', maxWidth: '1200px' }}
        />
      </Box>

      {/* Three Panels Below the Image */}
      <Grid container spacing={4} sx={{ marginTop: 4, justifyContent: 'center',maxWidth: '1200px' }}>
        <Grid item xs={12} md={6} >
		<Box sx={{ padding: 3,  borderRadius: 2 }}>
			<Typography variant="h5" sx={{ fontSize: "1.1rem" }}>
			<Typography variant="h5" sx={{ fontWeight: "bold", color: "#5ba2ff" }}>A passport is issued when the mandatory criteria are identified:</Typography>
				<Box
				sx={{
					textAlign: 'center'
				}}
				>
				<br/>
				<Typography variant="h5" sx={{ fontWeight: "bold", color: "#4caf50" }}>Platform</Typography>The physical system (e.g., float, buoy, tagged animal, station, mooring)<br/><br/>
				<Typography variant="h5" sx={{ fontWeight: "bold", color: "#4caf50" }}>Program</Typography>Responsible organisations and member state<br/><br/>
				<Typography variant="h5" sx={{ fontWeight: "bold", color: "#4caf50" }}>Variables Setup</Typography>Installed equipment (sensors) and their settings<br/><br/>
				<Typography variant="h5" sx={{ fontWeight: "bold", color: "#4caf50" }}>Deployment</Typography>Mission start date, location and deployment ship/cruise (if applicable)<br/>
				</Box>
			</Typography>
			</Box>
        </Grid>
        <Grid item xs={12} md={6}>
		<Box sx={{ padding: 3,  borderRadius: 2 }}>
		<Typography variant="h5" sx={{ fontSize: "1.1rem" }}>
			<Typography variant="h5" sx={{ fontWeight: "bold", color: "#5ba2ff" }}>This structured approach allows the GOOS to:</Typography>
			<Box
			component="ul"
			sx={{
				textAlign: 'left',
				paddingLeft: '40px', // Increase padding to accommodate the tick
				listStyle: 'none', // Remove default list bullets
				'& li': {
				position: 'relative', // Position the tick relative to the list item
				marginBottom: '12px', // Space out list items
				'&::before': {
					content: '"✔"', // Add the tick using the ::before pseudo-element
					color: '#4caf50', // Light green color for the tick
					position: 'absolute', // Position the tick absolutely
					left: '-20px', // Move the tick to the left of the list item
					top: '0', // Align the tick vertically with the list item
				},
				'& strong': {
					color: '#4caf50', // Green color for bold text
				},
				},
			}}
			>
			<li><strong>Ensure traceability</strong> of platform activity from deployment to retrieval.</li>
			<li><strong>Track GOOS contributions</strong>, including agencies, nations, and infrastructure.</li>
			<li><strong>Monitor observing capacity</strong> by tracking active and past deployments.</li>
			<li><strong>Validate metadata</strong> and integrate it into WMO, IOC, and GOOS databases.</li>
			<li><strong>Support coordination</strong> for planning, status updates, and gap response.</li>
			<li><strong>Improve data discoverability</strong> by linking missions to observations.</li>
			</Box>
		</Typography>
		</Box>
        </Grid>
        <Grid item xs={12} md={12} >
          <Box sx={{ padding: 2, borderRadius: 2 }}>
            <Typography variant="h5" sx={{fontSize: "1.5rem"}}>
              The issuance of a Platform Mission Passport therefore serves as validation that the mission meets GOOS objectives, ensuring that the deployment contributes to the global ocean observing system by adhering to established standards and FAIR principles, providing essential data, and supporting international collaboration.
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Passports;