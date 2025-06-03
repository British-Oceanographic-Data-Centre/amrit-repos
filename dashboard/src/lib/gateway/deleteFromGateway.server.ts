import { fetchFromGateway } from '@/lib/gateway/fetchFromGateway.server';

export async function deleteFromGateway<T>(path: string): Promise<T> {
  return fetchFromGateway<T>({
    method: 'DELETE',
    path
  });
}