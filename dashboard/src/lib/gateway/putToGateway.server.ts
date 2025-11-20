import { fetchFromGateway } from '@/lib/gateway/fetchFromGateway.server';
export const putToGateway = <TReq, TRes>(path: string, body?: TReq) =>
  fetchFromGateway<TRes>({ method: 'PUT', path, body });