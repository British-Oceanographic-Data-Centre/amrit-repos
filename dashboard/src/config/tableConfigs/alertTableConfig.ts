import { Alert, AlertAttributes, HistoryEntry, Note } from "@/types/alert";
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
    { key: 'lastNote', label: "Last note"},
    { key: 'attributes', label:"Link", subKey: 'url', link:true}
  ],
};

export const ALERTS_DETAILS_GENERAL_INFO_TABLE_CONFIG: TableViewConfig<Alert> = {
  mainColumns: [
    { key: 'id'},
    { key: 'origin', label: "Origin" },
    { key: 'service', label: "Service" },
    { key: 'createTime', label : "Alert creation time" },
    { key: 'lastReceiveTime', label : "Last receive time" },
    { key: 'previousSeverity', label : "Previous severity", chipColor: {"critical":"error", "major":"warning", "warning":"info", "informational":"success"} },
    { key: 'repeat', label : "Repeated ?" },
    { key: 'duplicateCount', label : "Number of duplicate" },
  ],
};

export const ALERTS_ATTRIBUTES_TABLE_CONFIG: TableViewConfig<{id: string} & AlertAttributes> = {
  mainColumns: [
    {key:'alert_category', label: "Alert category"},    
    {key:'Country'},
    {key:'wigos_id'}    
  ],
};

export const ALERTS_NOTES_TABLE_CONFIG: TableViewConfig<Note> = {
  mainColumns: [
    {key:'text', label:"Note"},
    {key: 'user', label:"User"},
    {key: 'createTime', label:"Added on"}
  ],
};

export const ALERTS_HISTORY_TABLE_CONFIG:  TableViewConfig<HistoryEntry> = {
  mainColumns: [
    {key:'updateTime', label:"Update time"},    
    {key:'type', label: "Change type", chipColor :{}},
    {key: 'value', label: "Value" },
    {key: 'text', label : "Description"},
    {key: 'user', label : "User"}

  ],
}


