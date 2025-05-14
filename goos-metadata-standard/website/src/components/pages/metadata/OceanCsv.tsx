import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Collapse } from '@mui/material';
import { useEffect, useState } from 'react';
import { PageProps } from '../PageProps';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

interface CSVHeader {
  headerCode: string;
  fieldTypeCode: string;
  propertyPath: string;
  aliases: string[];
}

const BASE_PATH = '/meta';

const OceanCsv: React.FC<PageProps> = ({ darkMode }) => {
  const [csvData, setCsvData] = useState<CSVHeader[]>([]);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  useEffect(() => {
    fetch(`${BASE_PATH}/data/oceanCsv.json`)
      .then((response) => response.json())
      .then((data) => setCsvData(data))
      .catch((error) => console.error('Error loading CSV data:', error));
  }, []);

  const handleRowClick = (index: number) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  return (
    <Box sx={{ padding: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h3" sx={{ fontWeight: 500, color: darkMode ? "#ffa36a" : "#ffa36a", marginBottom: 2 }}>
        Ocean<strong>CSV</strong>
      </Typography>

      <Typography variant="h5" sx={{ fontWeight: 500, marginBottom: 2 }}>
        Submitting Mission Metadata via CSV
      </Typography>

      <Typography paragraph sx={{ maxWidth: 800, textAlign: 'center' }}>
        You can submit mission metadata through the file uploader module in the dashboard using the following CSV headers:
      </Typography>

      <TableContainer component={Paper} sx={{ maxWidth: 1200, backgroundColor: darkMode ? '#2c2c2c' : '#fff', minWidth: '70vw' }}>
        <Table sx={{ border: '2px solid #ccc', borderRadius: '8px', overflow: 'hidden' }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: darkMode ? '#438cb0' : '#aae3ff', color: darkMode ? '#ffffff' : '#000000de' }}>
              <TableCell sx={{ color: darkMode ? '#ffffff' : '#282828de', fontWeight: 'bold', fontSize: '16px' }}>OceanCSV Header Code</TableCell>
              <TableCell sx={{ color: darkMode ? '#ffffff' : '#282828de', fontWeight: 'bold', fontSize: '16px' }}>Field Type</TableCell>
              <TableCell sx={{ color: darkMode ? '#ffffff' : '#282828de', fontWeight: 'bold', fontSize: '16px' }}>OceanJSON Property Path</TableCell>
              <TableCell sx={{ color: darkMode ? '#ffffff' : '#282828de', fontWeight: 'bold', fontSize: '16px' }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {csvData.map((row, index) => (
              <>
                <TableRow
					key={index}
					sx={{
						'&:nth-of-type(odd)': { backgroundColor: darkMode ? '#1e1e1e' : '#f9f9f9' },
						'&:hover': { backgroundColor: darkMode ? '#37474f' : '#e3f2fd' }, // Light blue hover color
						cursor: 'pointer',
						paddingBottom: 0, 
						paddingTop: 0 
					}}
					onClick={() => handleRowClick(index)}
                >
                  <TableCell sx={{color: darkMode ? '#ffa36a' : '#ffa36a', fontSize: '15px', paddingBottom: 0, paddingTop: 0 }}><strong>{row.headerCode}</strong></TableCell>
                  <TableCell sx={{paddingBottom: 0, paddingTop: 0 }}>{row.fieldTypeCode}</TableCell>
                  <TableCell sx={{paddingBottom: 0, paddingTop: 0, fontSize: '15px', fontFamily: 'Montserrat' }}>{row.propertyPath}</TableCell>
				  <TableCell sx={{paddingBottom: 0, paddingTop: 0 }}>
					<Box
					sx={{
						display: 'flex',
						alignItems: 'center',
						gap: 1,
						'&:hover': {
						'& .expand-text': {
							color: '#03a9f4', // Blue text on hover
							fontWeight: 'bold', // Bold text on hover
						},
						'& .expand-icon': {
							color: '#03a9f4', // Blue icon on hover
						},
						},
					}}
					>
					<IconButton size="large" className="expand-icon"> {/* Add a class for targeting */}
						{expandedRow === index ? (
						<ExpandLessIcon sx={{ fontSize: '2rem' }} />
						) : (
						<ExpandMoreIcon sx={{ fontSize: '2rem' }} />
						)}
					</IconButton>
					</Box>
				</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={4} style={{ paddingBottom: 0, paddingTop: 0 }}>
                    <Collapse in={expandedRow === index} timeout="auto" unmountOnExit>
                      <Box sx={{ margin: 1 }}>
                        <Typography variant="subtitle1" gutterBottom>
                          Aliases:
                        </Typography>
                        <Typography variant="body2">{row.aliases.join(', ')}</Typography>
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default OceanCsv;