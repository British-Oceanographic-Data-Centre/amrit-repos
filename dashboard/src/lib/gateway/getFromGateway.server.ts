import { fetchFromGateway } from '@/lib/gateway/fetchFromGateway.server';
export const getFromGateway =  <T>(path: string) =>
  fetchFromGateway<T>({ method: 'GET', path });