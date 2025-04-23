import { GATEWAY_BASE_URL } from "@/config/api-routes";
import { TopicOption } from "@/types/types";

const baseUrl = GATEWAY_BASE_URL;

export default async function fetchTopicOptions(): Promise<TopicOption[]> {
    const res = await fetch(`${baseUrl}/data/topics`, {credentials: 'include'});

    if (!res.ok) throw new Error('Failed to fetch topics');

    return await res.json();
  };