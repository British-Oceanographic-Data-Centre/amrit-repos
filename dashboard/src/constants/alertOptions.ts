import { FilterOption } from '@/types/filters';

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

   export type ActionType = (typeof ALERT_ACTIONS)[number]

   export type ChangeType = ActionType |  "new" | "action" | "status" | "value" | "severity" | "dismiss" | "timeout" | "expired" 

