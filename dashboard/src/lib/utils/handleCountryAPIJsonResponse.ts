import { CountryAPIResponse, CountryOption } from "@/types/types";

export function handleCountryAPIJsonResponse(json: CountryAPIResponse): CountryOption[] {
  return json.data
    .filter((item) => item.id && item.name)
    .map((item) => ({
      id: String(item.id),
      name: item.name ?? 'Unknown',
      code2: item.code2 ?? '',
    }));
}