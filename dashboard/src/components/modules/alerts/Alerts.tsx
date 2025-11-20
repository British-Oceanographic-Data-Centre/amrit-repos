import AlertsClientWrapper from './AlertsClientWrapper';
import { verifySession } from '@/app/_lib/session';
import { getFromGateway } from '@/lib/gateway/getFromGateway.server';
import { AlertsCount, EventsCount, ResourcesCount } from '@/types/alert';
import { CountryAPIResponse, CountryOption, Session, TopicOption } from '@/types/types';
import { FiltersValuesMap } from '@/types/filters';
import { handleCountryAPIJsonResponse } from '@/lib/utils/handleCountryAPIJsonResponse';

// server side component fetching data for the filters list
const Alerts = async () => {
  // get user info :
  const session:Session |null = await verifySession();

  // parallele fetch for alerts status and severities count from Alerta API and County list and topics from oceanops api
  const [countsRes, countryRes, topicsRes, eventsRes, resourcesRes] = await Promise.allSettled([
    getFromGateway<AlertsCount>('/alerta/alerts/count'),
    getFromGateway<CountryAPIResponse>('/data/countries'),
    getFromGateway<TopicOption[]>('/data/topics'),
    getFromGateway<EventsCount>('/alerta/alerts/events'),
    getFromGateway<ResourcesCount>('/alerta/alerts/resources'),
  ]);

  // retrieve values if no errors during fetch :
  //  alerts counts
  const counts = (countsRes.status === 'fulfilled' && countsRes.value) ? countsRes.value : { severityCounts: {}, statusCounts: {} } as AlertsCount
  // country list :
  const countryData = (countryRes.status === 'fulfilled' && countryRes.value) ? countryRes.value : {data:[]}
  const fetchedCountryOptions : CountryOption[]  = handleCountryAPIJsonResponse ( countryData);
  const sortedCountryOption = fetchedCountryOptions.sort((a, b) => a.name.localeCompare(b.name));
  // topics list :
  const topicsData = (topicsRes.status === 'fulfilled' && topicsRes.value) ? topicsRes.value : []
  // event list :
  const eventsCount = (eventsRes.status === 'fulfilled' && eventsRes.value) ? eventsRes.value : {events:[], status:null, total:0 }
   // resources list :
  const resourcesCount = (resourcesRes.status === 'fulfilled' && resourcesRes.value) ? resourcesRes.value : {resources:[], status:null, total:0 }

  // set the filters values list
  const filtersValues :FiltersValuesMap = {
    severity: Object.keys(counts?.severityCounts ?? {}),
    status:  Object.keys(counts?.statusCounts ?? {}),
    event: (eventsCount?.events ?? []).map(e => e?.event).filter(Boolean),
    resource : (resourcesCount?.resources ?? []).map(e => e?.resource).filter(Boolean),
    Country: sortedCountryOption,
    alert_category: topicsData
  }
  
 
  return (    
      <AlertsClientWrapper filtersValues={filtersValues} session={session}/>   
  );
};

export default Alerts;
