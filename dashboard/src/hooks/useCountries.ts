'use client';

import * as React from 'react';
import { gatewayFetchViaProxy } from '@/lib/gateway/gatewayFetchViaProxy.client';
import { handleCountryAPIJsonResponse } from '@/lib/utils/handleCountryAPIJsonResponse';
import type { CountryAPIResponse, CountryOption } from '@/types/types';

export function useCountries() {
  const [options, setOptions] = React.useState<CountryOption[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<unknown>(null);

  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const res = await gatewayFetchViaProxy<CountryAPIResponse>('GET', '/oceanops/data/countries');
        const list = handleCountryAPIJsonResponse(res); // CountryOption[]
        list.sort((a, b) => a.name.localeCompare(b.name));
        if (!alive) return;
        setOptions(list);
      } catch (e) {
        if (!alive) return;
        setError(e);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  return { options, loading, error };
}
