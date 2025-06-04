import { Box } from '@mui/material';
import AlertsClientWrapper from './AlertsClientWrapper';
import { verifySession } from '@/app/_lib/session';
import { getFromGateway } from '@/lib/gateway/getFromGateway.server';
import { AlertsCount } from '@/types/alert';
import { CountryAPIResponse, CountryOption } from '@/types/types';
import { FiltersValuesMap } from '@/types/filters';
import { handleCountryAPIJsonResponse } from '@/lib/utils/handleCountryAPIJsonResponse';


const Alerts = async () => {
  // get user info :
  const session = await verifySession();

  // fetch alerts status and severities count from Alerta API :
  const counts = await getFromGateway<AlertsCount>(
    '/alerta/alerts/count'
  )
  // fetch country list :
  const countryData = await getFromGateway<CountryAPIResponse>('/data/countries');
  const fetchedCountryOptions : CountryOption[]  = handleCountryAPIJsonResponse ( countryData);


  const sortedCountryOption = fetchedCountryOptions.sort((a, b) => a.name.localeCompare(b.name))


  // Fetch filters data server side
  const filtersValues :FiltersValuesMap = {
    severity: Object.entries(counts.severityCounts).map(([key, value])=> `${key} (${value})`),
    status:  Object.entries(counts.statusCounts).map(([key, value])=> `${key} (${value})`),    
    country: sortedCountryOption
  }
  
 
  return (
    <Box sx={{ width: '100%', padding: 2 }}>
      <AlertsClientWrapper filtersValues={filtersValues} isUserLogin={session?.isAuth ?? false}/>
    </Box>
  );
};

export default Alerts;
