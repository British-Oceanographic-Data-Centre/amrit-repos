import { ALERTS_FILTERS_REGEX_MATCH } from '@/config/alertsFiltersCategories';
import { ALERTA_API_BASE_URL } from '@/config/api-routes'
import { ALERT_CUSTOMS_PARAMS } from '@/constants/alertOptions';
import {  AlertApiResponse } from '@/types/alert';
import { FiltersValuesMap } from '@/types/filters';
import { CountryOption, TimeRange, TopicOption } from '@/types/types';
import { getUserAlertsSubscriptions } from '../alertSubscriptions/getUserAlertsSubscriptions.client';
import { AlertSubscription } from '@/types/alert-subscription';
import { getSeveritiesAboveMinSeverity } from '../utils/getSeveritiesAboveMinSeverity';
import { gatewayFetchViaProxy } from '../gateway/gatewayFetchViaProxy.client';
import { findAllChildrenTopicsFromId } from '../utils/findAllChildrenFromTopicId';

const baseUrl = ALERTA_API_BASE_URL;

export default async function getAlerts(filters:FiltersValuesMap = {"status": ["open", "ack"]}, page:number =1, pageSize:number =25, sortBy:Array<string> = ["severity"],history:boolean=false,isOnlyMySubsAlerts:boolean=false, userId:number=0, signal?: AbortSignal) : Promise<AlertApiResponse> {
  const queryStringParts: string[] = [];
  const timeRange: { from?: string, to?: string } = {}; // needed for a special handling with time range from subs and time range from filters
  
  // convert filters object to string for query parameters:
  let filterQuery = filtersToQueryString(filters);  

  // if there is a "q" query in filterQuery (for example from filters based on custom alert attributes) we want to extract it :
  let luceneQuery = "";
  const matchExistingQ = filterQuery.match(/(?:^|&)q=([^&]*)/);
  if (matchExistingQ) {
    luceneQuery = decodeURIComponent(matchExistingQ[1]);
    filterQuery = filterQuery.replace(/(?:^|&)q=[^&]*/, ""); // q query will be added again after and coupled with eventual q query from "user's subs only".
  }

  // if "isOnlyMySubsAlerts" we need to fetch user subscriptions and build a Lucene q query from it :
  if (isOnlyMySubsAlerts) {
    const userSubs: AlertSubscription[] = await getUserAlertsSubscriptions(userId);
    const {luceneQuery: luceneQueryFromUserSubs,timeRange: subsTimeRange}= await buildLuceneQueryFromSubscriptions(userSubs);
    
    //combining lucene q suery from filters with lucene q query from user's subs. It is a "AND" : filters apply in top of already subs filtered alets. 
    if (luceneQueryFromUserSubs) {
      luceneQuery = luceneQuery
        ? `(${luceneQuery}) AND ${luceneQueryFromUserSubs}`
        : luceneQueryFromUserSubs;
    }
    // special handling for date range from user'sub because Alerta Lucene q query doesn't support range queries by date (but support it with standard HTTP REST query)
    if (subsTimeRange.from) timeRange.from = subsTimeRange.from;
    if (subsTimeRange.to) timeRange.to = subsTimeRange.to;
  }

  // add q query to querystring parts :
  if (luceneQuery) {
    queryStringParts.push(`q=${encodeURIComponent(luceneQuery)}`);
  }
  // add default( page, pagesize, sortby) filters to query string parts
  queryStringParts.push(sortBy.map(s => `sort-by=${s}`).join("&"), `page=${page}`, `page-size=${pageSize}`, `show-history=${history}`);
  // add others eventuals filters to querystring parts :
  queryStringParts.push(filterQuery);
  // add time range from subs in queryStringParts if not already present from UI filters choices 
  if (!paramExistsInQueryParts(queryStringParts, 'from-date') && timeRange.from){
    queryStringParts.push(`from-date=${encodeURIComponent(new Date(timeRange.from).toISOString())}`);
  }
   if (!paramExistsInQueryParts(queryStringParts, 'to-date') && timeRange.to){
    queryStringParts.push(`to-date=${encodeURIComponent(new Date(timeRange.to).toISOString())}`);
  }

  //build request params
  const queryString = queryStringParts.filter(Boolean).join('&'); // we filter null, undefined or empty string "" and join in a string with a & separator
  
  // fetch data
  const res = await fetch(`${baseUrl}/alerts?${queryString}`, {signal,
    credentials: 'include'});

  if (!res.ok) throw new Error ("failed to fetch Alert data");

  return res.json();
}



/**
 * Transform the filters object  in a queryString. Clean values with a regex
 * @param filters Partial<Record<keyof Alert, string[]>> (ex: {"status" : ["open (251)", "ack (7)"], "severity": ["critical"]})
 * @returns string to be use in the request parameters // => status=open&status=ack&severity=critical
 */
function filtersToQueryString(filters: FiltersValuesMap): string {
  const params = new URLSearchParams();
  const qClauses: string[] = [];
  for (const [key, values] of Object.entries(filters) as [keyof FiltersValuesMap, FiltersValuesMap[keyof FiltersValuesMap]][]) {
    let valuesToProcess: string[] = [];
    const useRegex = (ALERTS_FILTERS_REGEX_MATCH as string[]).includes(key); // if we want a regex match

    if (key === "Country") {
      const countryValues = values as CountryOption[];
      valuesToProcess = countryValues.map(c => c.name);
    } else if (key === "alert_category") {
      const topics = values as TopicOption[];
      valuesToProcess = topics.map(c => c.label);
    } else {
      valuesToProcess = values as string[]
    }
    

    // If custom attributes, must be processed with Lucene query string `q=` (https://docs.alerta.io/api/query-syntax.html)
    if ((ALERT_CUSTOMS_PARAMS as readonly string[]).includes(key)) {
      const field = `_.${key}`;
      if (valuesToProcess.length === 1) {
        const val = valuesToProcess[0];
        const queryValue = useRegex ? `/${escapeRegex(val)}/` : escapeLuceneValue(val);
        qClauses.push(`${field}:${queryValue}`);
      } else if (valuesToProcess.length > 1) {
        const orValues = valuesToProcess.map(val => useRegex ? `/${escapeRegex(val)}/` : escapeLuceneValue(val)).join(" OR ");
        qClauses.push(`${field}:(${orValues})`);
      }
    } else {
      if (!Array.isArray(valuesToProcess)) {
        cleanAndAppendKeyValueToParam(valuesToProcess, key, useRegex, params);
      } else {
        for (const val of valuesToProcess) {
          cleanAndAppendKeyValueToParam(val, key, useRegex, params);
        }
      }
    }
  }

  // add 'q' parameter if needed
  if (qClauses.length > 0) {
    params.append("q", qClauses.join(" AND "));
  }

  return params.toString();
}

function cleanAndAppendKeyValueToParam(val: string, key: string, useRegex: boolean, params: URLSearchParams) {
  const cleanValue = val.replace(/\s*\(\d+\)\s*$/, '').trim();
  let newKey = key;
  if ((ALERT_CUSTOMS_PARAMS as readonly string[]).includes(newKey)) {
    newKey = "attributes." + newKey;
  }
  // if a regex match is neededs        
  const finalValue = useRegex ? `~${cleanValue}` : cleanValue;

  params.append(newKey, finalValue);
}

function escapeLuceneValue(value: string): string {
  // Protect space or key word like AND or OR
  const safe = value.replace(/"/g, '\\"').trim();
  return `"${safe}"`;
}

function escapeRegex(value: string): string {
  return value.replace(/\s*\(\d+\)\s*$/, '').trim(); 
}

async function buildLuceneQueryFromSubscriptions(subs: AlertSubscription[]): Promise<{ luceneQuery: string, timeRange: TimeRange }> {
  const orClauses: string[] = [];
  // Currently not possible to make Lucene q query with date range in Alerta.
  // Need to handle subs date range with the classic http from-date= and to-date= query parameters.
  const fromDates: string[] = [];
  const toDates: string[] = [];

  for (const sub of subs ) {
    const andClauses: string[] = [];
    if (sub.countryName) {
      andClauses.push(`_.Country:"${sub.countryName}"`)
    }

    if (sub.minSeverityId) {
      const severitiesToIncludeInQuery = getSeveritiesAboveMinSeverity(sub.minSeverityId);
      andClauses.push(`severity:(${severitiesToIncludeInQuery.join(" OR ")})`)
    }

    if (sub.topicId) {
      // retrieve topics list : 
      const topicsData = await gatewayFetchViaProxy<TopicOption[]>('GET','/data/topics');
      // get relevant list of topic from user's sub topicId : 
      const topicsToIncludeInQuery = findAllChildrenTopicsFromId(topicsData,sub.topicId).map(t => escapeLuceneValue(t.label));
      andClauses.push(`_.alert_category:(${topicsToIncludeInQuery.join(" OR ")})`)
    }

    if (sub.minTime) {
      fromDates.push(sub.minTime);
    }
    if (sub.maxTime) {
      toDates.push(sub.maxTime);
    }

    if (sub.wigosId) {
      andClauses.push(`_.wigos_id:"${sub.wigosId}"`)
    }

    if (sub.basinId) {
      andClauses.push(`_.basin_id:"${sub.basinId}"`)
    }

    if (andClauses.length > 0) {
      orClauses.push(`(${andClauses.join(" AND ")})`);
    }
  }

  const luceneQuery = orClauses.length > 0 ? `(${orClauses.join(" OR ")})` : "";

  // special handling for date range : we create a single global covering date range from the different subscriptions. 
  // Not ideal but no choice
  const timeRange: TimeRange = {};
  if (fromDates.length > 0) {
      timeRange.from = fromDates.reduce((a, b) => a < b ? a : b); // earliest minTime
  }
  if (toDates.length > 0) {
      timeRange.to = toDates.reduce((a, b) => a > b ? a : b); // latest maxTime
  }

  return { luceneQuery, timeRange };
}

function paramExistsInQueryParts(queryParts: string[], param: string): boolean {
  
  return queryParts.some(part => {
    return part.split('&').some(p => p.startsWith(param + "="));
  });
}