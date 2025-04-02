import { Box } from '@mui/material';
import EnhancedTable from './alertsTable/EnhancedTable';
import AlertTopbar from './AlertTopbar';
import { getAlertCount } from '@/lib/fetchAlerts';
import AlertsClientWrapper from './AlertsClientWrapper';


const Alerts = async () => {
  // fetch filters data here (server side) :
  const alertsCountData = getAlertCount();
  const counts = await alertsCountData;

  const filtersData = {
    severity: Object.entries(counts.severityCounts).map(([key, value])=> `${key} (${value})`),
    status:  Object.entries(counts.statusCounts).map(([key, value])=> `${key} (${value})`)
  }
 
 
  return (
    <Box sx={{ width: '100%', padding: 2 }}>
      <AlertsClientWrapper filtersData={filtersData}/>
    </Box>
  );
};

export default Alerts;
