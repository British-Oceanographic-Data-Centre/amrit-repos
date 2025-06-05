import { AlertFilters } from "@/constants/alertOptions";
import { CountryOption, TopicOption } from "./types";

export interface FilterOption {
  code2?: string;
  id?: string | number;
  name?: string;
  label?: string;
  value?: string;
}

// Dynamic type. Default string[]
export type FiltersValuesMap = Partial<{
  [K in AlertFilters]: 
    K extends "Country" ? CountryOption[] :
    K extends "alert_category" ? TopicOption[] :
    K extends "from-date" | "to-date" ? string :
    string[];
}>;