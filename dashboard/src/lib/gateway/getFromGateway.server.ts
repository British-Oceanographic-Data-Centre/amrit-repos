import { fetchFromGateway } from '@/lib/gateway/fetchFromGateway.server';

export async function getFromGateway<T>(path: string): Promise<T> {
  return fetchFromGateway<T>({ method: 'GET', path });
}
