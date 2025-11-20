import { fetchFromGateway } from '@/lib/gateway/fetchFromGateway.server';
export const deleteFromGateway = <TRes>(path: string) =>
  fetchFromGateway<TRes>({ method: 'DELETE', path });