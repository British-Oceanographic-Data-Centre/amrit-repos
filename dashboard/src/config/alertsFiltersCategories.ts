import { AlertFilters } from "@/constants/alertOptions";

export const ALERTS_FILTERS_CATEGORY : Record<string, AlertFilters[]> = {

    General : ["event", "alert_category","status", "severity", 'from-date', "to-date"],
    Identifiers : ["resource"],
    Localization : ["Country"]


}

// attribute for which we want a regex match contains (=~)
export const ALERTS_FILTERS_REGEX_MATCH: AlertFilters[] = ['resource', 'event']