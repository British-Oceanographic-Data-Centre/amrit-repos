import { EventsCount, ResourcesCount } from "@/types/alert";
import { gatewayFetchViaProxy } from "../gateway/gatewayFetchViaProxy.client";

export async function fetchEventsList(): Promise<EventsCount> {
  return gatewayFetchViaProxy<EventsCount>('GET',`/alerta/alerts/events`);
};

export async function fetchResourcesList(): Promise<ResourcesCount> {
  return gatewayFetchViaProxy<ResourcesCount>('GET',`/alerta/alerts/resources`);
};
