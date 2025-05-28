import actOnAlerts from "@/lib/alerta/actOnAlerts.client";
import addNoteOnAlerts from "@/lib/alerta/addNoteOnAlerts.client";
import { AlertColor, AlertPropsColorOverrides } from "@mui/material";
import { OverridableStringUnion } from '@mui/types';
import { useState } from "react";

export const useAlertActions = (
    selected: readonly string[],
    onActionDone: () =>void
) => {

    const [loading, setLoading] = useState(false);
    const [resultsMessage, setResultsMessage] = useState<string |null>(null)
    const [severity, setSeverity] = useState<OverridableStringUnion<AlertColor, AlertPropsColorOverrides>>("success")

    const handleActOnAlerts = async (action: "ack" | "unack" | "note", noteText?:string) : Promise<void> => {
            // which action to do :
            const actionHandlers = {
                ack: () => actOnAlerts(selected, 'ack'),
                unack: () => actOnAlerts(selected, 'unack'),
                note: () => addNoteOnAlerts(selected, noteText || ''),
            };        
            setLoading(true);        
            try {
                 if (!actionHandlers[action]) {
                    throw new Error(`Unsupported action: ${action}`);                
                }
                //act on alert :
                const results = await actionHandlers[action]();
    
                // handle differents results :
                if (results.success > 0 && results.failed > 0) {
                    setResultsMessage(`${results.success} alert${results.success === 1 ? ' was' : 's were'} successfully updated (${action}) but ${results.failed} ${results.failed === 1 ? 'was' : 'were'} not.`);
                    setSeverity("warning");
                } else if (results.success > 0) {
                    setResultsMessage(`Successfully updated (${action}) ${results.success} alert${results.success === 1 ? '' : 's'}.`);
                    setSeverity("success");
                } else {
                    setResultsMessage(`No alert was updated`);
                    setSeverity("warning");               
                }
            } catch {
                setResultsMessage(`Something went wrong while ${action}nowledging alerts.`);
                setSeverity("error");
            } finally {             
                setLoading(false)
                onActionDone();                
            }
        }

         return {
            loading,
            handleActOnAlerts,
            resultsMessage,
            severity,
            clearResultMessage: () => setResultsMessage(null),
            
        }

}