import { ALERT_SEVERITIES, AlertSeverity } from "@/constants/alertOptions";

export function getSeveritiesAboveMinSeverity(minSeverity: string): AlertSeverity[] {
  const index = ALERT_SEVERITIES.findIndex(
    s => s.toLowerCase() === minSeverity.toLowerCase()
  );
  if (index === -1) return [];

  // Slice from 0 (most critical) to index (inclusive)
  return ALERT_SEVERITIES.slice(0, index + 1);
}