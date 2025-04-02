import { ALERTA_API_BASE_URL } from '@/config/api-routes'
import { AlertApiResponse } from '@/types/alert';

const baseUrl = ALERTA_API_BASE_URL;


export default async function getAlerts(status:Array<string> = ["open"], page:number =1, pageSize:number =25, sortBy:Array<string> = ["severity"], signal?: AbortSignal) : Promise<AlertApiResponse> {
  // convert status[] to string for query parameters:
  const statusQuery=status.map(s => `status=${s}`).join("&");
  // convert sortBy[] to string for query parameters:
  const sortByQuery=sortBy.map(s => `sort-by=${s}`).join("&");

  // fetch data
  const res = await fetch(`${baseUrl}/alerts?${statusQuery}&page=${page}&page-size=${pageSize}&${sortByQuery}`, {signal});

  if (!res.ok) throw new Error ("failed to fetch Alert data");

  return res.json();
}
