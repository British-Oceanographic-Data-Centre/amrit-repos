import { fetchFromGateway } from '@/lib/gateway/fetchFromGateway.server';
export const postToGateway = <TReq, TRes>(path: string, body?: TReq) =>
  fetchFromGateway<TRes>({ method: 'POST', path, body });