import { ALERTS_FILTERS_REGEX_MATCH } from '@/config/alertsFiltersCategories';
import { ALERTA_API_BASE_URL } from '@/config/api-routes'
import { ALERT_CUSTOMS_PARAMS } from '@/constants/alertOptions';
import {  AlertApiResponse } from '@/types/alert';
import { FiltersValuesMap } from '@/types/filters';
import { CountryOption, TopicOption } from '@/types/types';

const baseUrl = ALERTA_API_BASE_URL;


export default async function getAlerts(filters:FiltersValuesMap = {"status": ["open", "ack"]}, page:number =1, pageSize:number =25, sortBy:Array<string> = ["severity"],history:boolean=false, signal?: AbortSignal) : Promise<AlertApiResponse> {
  // convert filters object to string for query parameters:
  const filterQuery = filtersToQueryString(filters);
  // convert sortBy[] to string for query parameters:
  const sortByQuery=sortBy.map(s => `sort-by=${s}`).join("&");
  // pagination :
  const pagination = `page=${page}&page-size=${pageSize}`;
  // history
  const showHistory= `show-history=${history}`

  //build request params
  const queryString = [filterQuery, sortByQuery, pagination, showHistory].filter(Boolean).join('&'); // we filter null, undefined or empty string "" and join in a string with a & separator

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
function filtersToQueryString(filters:FiltersValuesMap): string {
  const params = new URLSearchParams();

  for (const [key, values] of Object.entries(filters) as [keyof FiltersValuesMap, FiltersValuesMap[keyof FiltersValuesMap]][]) {
    let valuesToProcess : string | string [];

    // special cases CountryOption[] & TopicOption[]:
    if (key === "Country") {
      const countryValues = values as CountryOption[]
      valuesToProcess = countryValues.map(c => c.name);
    } else if (key === "alert_category") {
        const topics = values as TopicOption[];
        valuesToProcess = topics.map(c => c.label);
    } else {
      valuesToProcess = values as string |string[];
    }
      
   
    if (Array.isArray(valuesToProcess)) {
      valuesToProcess?.forEach((value) => {
        cleanAndAppendKeysValuesToQueryParams(params, key, value)
      });
    } else if (valuesToProcess !== undefined) {
      cleanAndAppendKeysValuesToQueryParams(params, key, valuesToProcess)
    }

    
  
  } 

  return params.toString(); 
}

function cleanAndAppendKeysValuesToQueryParams (params : URLSearchParams,key:string, value: string ) {
  // clean values
  let cleanValue = value.replace(/\s*\(\d+\)\s*$/, '').trim();

  //  special case for search regex mactj :
  if ((ALERTS_FILTERS_REGEX_MATCH as string[]).includes(key)) {
    cleanValue="~"+cleanValue
  }

  // modify key if needed (special case for custom attributes) :
  let newKey = key;
  if((ALERT_CUSTOMS_PARAMS as readonly string[]).includes(newKey)) {
    newKey="attributes."+newKey
  }  
  params.append(newKey, cleanValue);
}