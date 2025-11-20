import { fetchFromGateway } from '@/lib/gateway/fetchFromGateway.server';
export const patchToGateway = <TReq, TRes>(path: string, body?: TReq) =>
  fetchFromGateway<TRes>({ method: 'PATCH', path, body });