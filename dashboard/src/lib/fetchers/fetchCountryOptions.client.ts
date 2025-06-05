import { GATEWAY_BASE_URL } from "@/config/api-routes";
import { FilterOption } from "@/types/filters";
import { CountryAPIResponse } from "@/types/types";
import { handleCountryAPIJsonResponse } from "../utils/handleCountryAPIJsonResponse";

const baseUrl = GATEWAY_BASE_URL;



export default async function fetchCountryOptions(): Promise<FilterOption[]> {
  const res = await fetch(`${baseUrl}/data/countries`, {
    credentials: 'include',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch countries');
  }

  const json: CountryAPIResponse = await res.json();

  return handleCountryAPIJsonResponse(json);
}


