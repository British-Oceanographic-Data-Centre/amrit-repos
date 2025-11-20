
export interface TableColumnConfig<T> {
	key: keyof T;
  subKey?: string; 
  label?: string;
  align?: 'left' | 'right' | 'center';
  padding?: 'none' | 'normal';
  chipColor? : Record<string, "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" | undefined>; // Will be displayed in form of a chip if set. Depend on value of the specific key : {"value": "chip color", }
  link? : boolean
}

export interface EditableTableColumnConfig<T> extends TableColumnConfig<T> {
	editable?: boolean;
	render?: (row: T, context?: TableColumnRenderContext<T>) => React.ReactNode;
  }

export interface TableViewConfig<T> {
	mainColumns: TableColumnConfig<T>[];	
  }

export interface EditableTableViewConfig<T> {
  mainColumns: EditableTableColumnConfig<T>[];
}
export interface TableColumnRenderContext<T> {
	onToggleSwitch?: (id: string, key: keyof T, newValue: boolean) => void;
	onUpdateField?: (id: string, key: keyof T, value: T[keyof T]) => void;
	onOpenAddFilter?: (id: string) => void;
}


