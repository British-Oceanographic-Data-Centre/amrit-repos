import { Alert } from "@/types/alert";

  interface TableColumnConfig<T> {
	key: keyof T;
  label?: string;
  align?: 'left' | 'right' | 'center';
  padding?: 'none' | 'normal'
  chipColor? : Record<string, "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" | undefined> // Will be displayed in form of a chip if set. Depend on value of the specific key : {"value": "chip color", }

}

export interface TableViewConfig<T> {
	mainColumns: TableColumnConfig<T>[];
	moreInfoColumns?: TableColumnConfig<T>[];
  }

export interface TableColumnRenderContext<T> {
	onToggleSwitch?: (id: string, key: keyof T, newValue: boolean) => void;
	onUpdateField?: (id: string, key: keyof T, value: T[keyof T]) => void;
	onOpenAddFilter?: (id: string) => void;
}

export interface EditableTableColumnConfig<T> {
	key: keyof T | string;
	label?: string;
	align?: 'left' | 'right' | 'center';
	padding?: 'none' | 'normal';
	editable?: boolean;
	render?: (row: T, context?: TableColumnRenderContext<T>) => React.ReactNode;
  }


export interface EditableTableViewConfig<T> {
  mainColumns: EditableTableColumnConfig<T>[];
}

export const ALERTS_TABLE_CONFIG: TableViewConfig<Alert> = {
  mainColumns: [
    { key: 'resource', label: "Resource", padding: 'none' },
    { key: 'severity', label: "Severity", chipColor: {"critical":"error", "major":"warning", "warning":"info", "informational":"success"} },
    { key: 'status', label: "Status" },
    { key: 'event', label:"Event" },
    { key: 'value', label: "Value" },
    { key: 'text', label: "Description" },
    { key: 'lastReceiveTime', label: "Last receive Time"  }
  ],
  moreInfoColumns: [
    { key: 'id' },
    { key: 'origin', label: "Origin" },
    { key: 'createTime', label : "Alert creation time" },
    { key: 'duplicateCount', label : "Number of duplicate" }
  ]
};
