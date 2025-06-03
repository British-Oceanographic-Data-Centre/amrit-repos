import { AlertFilters } from "@/constants/alertOptions";

export const ALERTS_FILTERS_CATEGORY : Record<string, AlertFilters[]> = {

    General : ["status", "severity", 'from-date', "to-date"],
    Identifiers : ["resource"],
    Localization : ["country"]


}