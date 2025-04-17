import { ALERTA_API_BASE_URL } from "@/config/api-routes";
import batchRequestByIds from "../utils/batchRequestByIds";

const baseUrl = ALERTA_API_BASE_URL;

export default async function actOnAlerts (ids : readonly string[], action:"ack" | "unack") {

  const ackAlert = async (id :string ) =>  await fetch (`${baseUrl}/alert/${id}/action`, {
    method: "put",
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        action: action,
        timeout: null
      }),
      credentials: 'include'
  })

  return batchRequestByIds(ids, ackAlert);
    

}