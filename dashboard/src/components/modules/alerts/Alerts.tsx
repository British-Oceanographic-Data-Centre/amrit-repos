import { Box } from '@mui/material';
import AlertsClientWrapper from './AlertsClientWrapper';
import { verifySession } from '@/app/_lib/session';
import { getFromGateway } from '@/lib/gateway/getFromGateway.server';
import { AlertsCount } from '@/types/alert';
import { CountryAPIResponse, CountryOption, Session, TopicOption } from '@/types/types';
import { FiltersValuesMap } from '@/types/filters';
import { handleCountryAPIJsonResponse } from '@/lib/utils/handleCountryAPIJsonResponse';


const Alerts = async () => {
  // get user info :
  const session:Session |null = await verifySession();

  // fetch alerts status and severities count from Alerta API :
  const counts = await getFromGateway<AlertsCount>(
    '/alerta/alerts/count'
  )
  // fetch country list :
  const countryData = await getFromGateway<CountryAPIResponse>('/data/countries');
  const fetchedCountryOptions : CountryOption[]  = handleCountryAPIJsonResponse ( countryData);
  const sortedCountryOption = fetchedCountryOptions.sort((a, b) => a.name.localeCompare(b.name));

  // fetch topics list :
  const topicsData = await getFromGateway<TopicOption[]>('/data/topics');


  // Fetch filters data server side
  const filtersValues :FiltersValuesMap = {
    severity: Object.entries(counts.severityCounts).map(([key, value])=> `${key} (${value})`),
    status:  Object.entries(counts.statusCounts).map(([key, value])=> `${key} (${value})`),    
    Country: sortedCountryOption,
    alert_category: topicsData
  }
  
 
  return (
    <Box sx={{ width: '100%', padding: 2 }}>
      <AlertsClientWrapper filtersValues={filtersValues} session={session}/>
    </Box>
  );
};

export default Alerts;
