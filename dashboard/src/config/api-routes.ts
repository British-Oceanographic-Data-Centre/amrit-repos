export const GATEWAY_BASE_URL = process.env.NEXT_PUBLIC_GATEWAY_BASE_URL || 'http://localhost:3001/api'


export const ALERTA_API_BASE_URL =GATEWAY_BASE_URL +'/alerta';

export const AUTHSERVICE_API_BASE_URL =GATEWAY_BASE_URL +'/oceanops/auth';