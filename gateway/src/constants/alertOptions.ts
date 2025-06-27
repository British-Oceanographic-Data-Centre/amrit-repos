import { FilterOption } from '../types/filters';

export const ALERT_SEVERITIES = [
  "security",
  "critical",
  "major",
  "minor",
  "warning",
  "informational",
  "debug",
  "trace",
  "indeterminate",
  "cleared",
  "normal",
  "ok",
  "unknown",
] as const;

export type AlertSeverity = (typeof ALERT_SEVERITIES)[number];

export const ALERT_SEVERITY_OPTIONS: FilterOption[] = Array.from(ALERT_SEVERITIES).map((sev) => ({
  value: sev,
  label: sev.charAt(0).toUpperCase() + sev.slice(1),
}));

export const ALERT_STATUSES = [
  "open",
  "assign",
  "ack",
  "closed",
  "expired",
  "blackout",
  "shelved",
  "unknown",
] as const;

export type AlertStatus = (typeof ALERT_STATUSES)[number];

export const ALERT_ACTIONS = ["open",
   "ack",
   "unack",
   "close",
   "delete",
   "shelve",
   "unshelve",
   "assign",
   "note" ] as const 


export const ALERTS_FILTERS = [
    "status", "severity", "Country", "from-date", "to-date", "resource", "alert_category"
] as const

export const ALERT_CATEGORIES = [
  "Operations alerts",
  "Data management",
  "Information",
  "Support requests",
  "EEZ","Beaching",
  "Icing",
  "Technical issue","Battery issue", "Sensor issue",
  "Data checker",
  "QC feedback",
  "Metadata check",
  "Platform",
  "Cruises",
  "Data",
  "New platform",
  "New Cruises",
  "New data flow",
  "Deployment/Retrieval",
  "Deployment request",
  "Retrieval request",
  "Data processing request",
  "Data access request",
  "Dashboard"] as const

export type AlertCategory = (typeof ALERT_CATEGORIES) [number]

export const ALERT_MQTT_TOPICS = ["operations-alerts"
    , "data-management"
    , "information"
    , "support-requests"]


export const ALERT_CUSTOMS_PARAMS = ['Country', 'basin_id', 'alert_category', 'mqtt_topic' ] as const;


export type MqttTopic = (typeof ALERT_MQTT_TOPICS) [number]

export type AlertFilters = (typeof ALERTS_FILTERS)[number]

export type ActionType = (typeof ALERT_ACTIONS)[number]

export type ChangeType = ActionType |  "new" | "action" | "status" | "value" | "severity" | "dismiss" | "timeout" | "expired" 
