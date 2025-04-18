'use client';

import {
  TableRow,
  TableCell,
  IconButton,
  Tooltip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { EditableTableViewConfig } from '@/config/tableConfigs';
import React from 'react';

interface EditableTableRowProps<T> {
  rowData: T;
  columnsConfig: EditableTableViewConfig<T>;
  onDelete?: (id: string) => void;
  onUpdateField?: (id: string, key: keyof T, value: T[keyof T]) => void;
  onToggleSwitch?: (id: string, key: keyof T, newValue: boolean) => void;
  onRenderEditableCell?: (row: T, key: keyof T) => React.ReactNode;
  onOpenAddFilter?: (id: string) => void;
}

function EditableTableRow<T extends { id: string }>({
  rowData,
  columnsConfig,
  onDelete,
  onUpdateField,
  onToggleSwitch,
  onOpenAddFilter
}: EditableTableRowProps<T>) {
  return (
    <TableRow hover>

	{columnsConfig.mainColumns.map((col, index) => {
		const cellContent = typeof col.render === 'function'
			? col.render(rowData, { onToggleSwitch, onUpdateField , onOpenAddFilter})
			: '';

		return (
			<TableCell
				key={`${String(col.key)}-${rowData.id}`}
				component={index === 0 ? 'th' : undefined}
				scope={index === 0 ? 'row' : undefined}
				padding={index === 0 ? 'none' : undefined}
				align={col.align ?? (index !== 0 ? 'left' : undefined)}
			>
				{cellContent}
			</TableCell>
		);
	})}

      {/* Delete button */}
	  {onDelete && (
		<TableCell align="right" padding="none" sx={{ pr: 2 }}>
			<Tooltip title="Delete">
			<IconButton
				size="small"
				onClick={(e) => {
					e.stopPropagation();
					onDelete(rowData.id);
				}}
				
				sx={{
					color: (theme) => theme.palette.primary.main,
					'&:hover': {
					color: (theme) => theme.palette.secondary.main,
					},
					borderRadius: 2,
					transition: 'background-color 0.2s ease',
				}}
			>
				<DeleteIcon />
			</IconButton>
			</Tooltip>
		</TableCell>
		)}
    </TableRow>
  );
}

export default EditableTableRow;
