import { ALERTA_API_BASE_URL } from "@/config/api-routes";
import batchRequestByIds from "../utils/batchRequestByIds";
import { ActionType } from "@/constants/alertOptions";


const baseUrl = ALERTA_API_BASE_URL;

/**
 * Launch fetch methods (PUT or DELETE) for each alert id given in ids[] parameter
 * @param ids List of id
 * @param action type of action : ack, unack, close or delete
 * @returns 
 */
export default async function actOnAlerts (ids : readonly string[], action: ActionType, text="") {

  switch (action) {
    case 'ack':
    case 'unack' :
    case 'open' :
    case 'close' :
    case "shelve" :
    case "unshelve" :
    case "assign" :
      return batchRequestByIds(ids, (id)=> actionAlert(id, action));
    case 'delete':
      return batchRequestByIds(ids,deleteAlert );
    case 'note' :
      return batchRequestByIds(ids, (id)=> addNoteOnAlert (id, text));
  } 
    

}

const actionAlert = async (id :string, action:ActionType ) =>  await fetch (`${baseUrl}/alert/${id}/action`, {
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

const deleteAlert = async (id: string) => await fetch (`${baseUrl}/alert/${id}`, {
    method: "delete",
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },      
      credentials: 'include'
  })

const addNoteOnAlert = async (alertId :string, text:string ) =>  await fetch (`${baseUrl}/alert/${alertId}/note`, {
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

