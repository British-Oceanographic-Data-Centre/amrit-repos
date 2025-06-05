import { AlertFilters } from "@/constants/alertOptions";

export const ALERTS_FILTERS_CATEGORY : Record<string, AlertFilters[]> = {

    General : ["alert_category","status", "severity", 'from-date', "to-date"],
    Identifiers : ["resource"],
    Localization : ["Country"]


}

export const ALERTS_FILTERS_REGEX_MATCH: AlertFilters[] = ['resource']