import { AlertSubscription } from "@/types/alert-subscription";
import { gatewayFetchViaProxy } from "../gateway/gatewayFetchViaProxy.client";

export async function getUserAlertsSubscriptions (userId: number) :Promise<AlertSubscription[]> {
return gatewayFetchViaProxy<AlertSubscription[]>(
            'GET',
            '/oceanops/alerts/subscriptions?contactId='+userId
        );		
}