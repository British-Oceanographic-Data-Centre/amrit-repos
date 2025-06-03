import { Box } from '@mui/material';
import AlertsClientWrapper from './AlertsClientWrapper';
import { verifySession } from '@/app/_lib/session';
import { getAlertCount } from '@/lib/alerta/getAlertsCount.server';


const Alerts = async () => {
  // get user info :
  const session = await verifySession();

  // fetch filters data here (server side) :
  let counts;
  try {
  counts = await getAlertCount();
  
  } catch {
    counts = {
      severityCounts: {},
      statusCounts: {},
    };  
  }


  // Fetch filters data server side
  const filtersValues = {
    severity: Object.entries(counts.severityCounts).map(([key, value])=> `${key} (${value})`),
    status:  Object.entries(counts.statusCounts).map(([key, value])=> `${key} (${value})`)    
    
  }
 
 
  return (
    <Box sx={{ width: '100%', padding: 2 }}>
      <AlertsClientWrapper filtersValues={filtersValues} isUserLogin={session?.isAuth ?? false}/>
    </Box>
  );
};

export default Alerts;
