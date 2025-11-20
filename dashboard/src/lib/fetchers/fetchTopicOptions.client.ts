import { TopicOption } from "@/types/types";
import { gatewayFetchViaProxy } from "../gateway/gatewayFetchViaProxy.client";


export default async function fetchTopicOptions(): Promise<TopicOption[]> {
  return gatewayFetchViaProxy<TopicOption[]>('GET',`/data/topics`,undefined, undefined, true );
};