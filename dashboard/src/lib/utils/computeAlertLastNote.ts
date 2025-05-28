import { Alert, AlertApiResponse } from "@/types/alert";


/**Retrieve the text of an Alert's last note (if exists) by looping on alert's history entries  */
export function computeAlertLastNote (alert: Alert) {
    let lastNote;
    for ( let i = alert.history.length - 1; i >= 0; i--  ) {
        if (alert.history[i].type=="note"){
            lastNote=`${alert.history[i].user} : ${alert.history[i].text}`;
            break;
        }
    }
    return lastNote;
}

/**Loop in alerts from AlertApiResponse and compute the lastNote for each alert */
export default function  addAlertsLastNotesToAlertApiResponse (alertApiResponse: AlertApiResponse) {
    for (const alert of alertApiResponse.alerts) {
        alert.lastNote=computeAlertLastNote(alert);
    }
}