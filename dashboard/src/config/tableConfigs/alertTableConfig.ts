import { Alert } from "@/types/alert";
import { TableViewConfig } from "../tableConfigs";

export const ALERTS_MAIN_TABLE_CONFIG: TableViewConfig<Alert> = {
    mainColumns: [
      { key: 'resource', label: "Resource", padding: 'none' },
      { key: 'severity', label: "Severity", chipColor: {"critical":"error", "major":"warning", "warning":"info", "informational":"success"} },
      { key: 'status', label: "Status" },
      { key: 'event', label:"Event" },
      { key: 'value', label: "Value" },
      { key: 'text', label: "Description" },      
      { key: 'lastReceiveTime', label: "Last receive Time" },
      { key: 'lastNote', label: "Last note"}
    ],
  };