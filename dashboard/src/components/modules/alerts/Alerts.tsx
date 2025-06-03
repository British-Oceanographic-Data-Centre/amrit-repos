import { Box } from '@mui/material';
import AlertsClientWrapper from './AlertsClientWrapper';
import { verifySession } from '@/app/_lib/session';
import { getFromGateway } from '@/lib/gateway/getFromGateway.server';
import { AlertsCount } from '@/types/alert';


const Alerts = async () => {
  // get user info :
  const session = await verifySession();

  // fetch alerts status and severities count from Alerta API :
  const counts = await getFromGateway<AlertsCount>(
    '/alerta/alerts/count'
  )


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
