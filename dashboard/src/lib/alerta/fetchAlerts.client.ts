import { ALERTA_API_BASE_URL } from '@/config/api-routes'
import { Alert, AlertApiResponse } from '@/types/alert';

const baseUrl = ALERTA_API_BASE_URL;


export default async function getAlerts(filters:Partial<Record<keyof Alert, string[]>> = {"status": ["open", "ack"]}, page:number =1, pageSize:number =25, sortBy:Array<string> = ["severity"], signal?: AbortSignal) : Promise<AlertApiResponse> {
  // convert filters object to string for query parameters:
  const filterQuery = filtersToQueryString(filters);
  // convert sortBy[] to string for query parameters:
  const sortByQuery=sortBy.map(s => `sort-by=${s}`).join("&");
  // pagination :
  const pagination = `page=${page}&page-size=${pageSize}`;

  //build request params
  const queryString = [filterQuery, sortByQuery, pagination].filter(Boolean).join('&'); // we filter null, undefined or empty string "" and join in a string with a & separator

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
function filtersToQueryString(filters: Partial<Record<keyof Alert, string[]>>): string {
  const params = new URLSearchParams();

  for (const [key, values] of Object.entries(filters)) {
    values?.forEach((value) => {
      const cleanValue = value.replace(/\s*\(\d+\)\s*$/, '').trim(); 
      params.append(key, cleanValue);
    });
  }

  return params.toString(); 
}