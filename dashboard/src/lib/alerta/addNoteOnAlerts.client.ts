import { ALERTA_API_BASE_URL } from "@/config/api-routes";
import batchRequestByIds from "../utils/batchRequestByIds";

const baseUrl = ALERTA_API_BASE_URL;

export default async function addNoteOnAlerts (ids : readonly string[], text:string) {

  const addNoteOnAlert = async (alertId :string ) =>  await fetch (`${baseUrl}/alert/${alertId}/note`, {
    method: "put",
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text:text
      }),
      credentials: 'include'
  })

  return batchRequestByIds(ids, addNoteOnAlert);
    

}